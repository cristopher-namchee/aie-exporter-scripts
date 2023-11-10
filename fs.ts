import fs from 'node:fs';
import path from 'node:path';

import { DirectoryFile, ResultFile } from './typedef';

export function isDir(filePath: string): boolean {
  const realPath = path.resolve(process.cwd(), filePath);
  const stat = fs.lstatSync(realPath);

  return stat.isDirectory();
}

export function getFile(filePath: string): DirectoryFile {
  const realPath = path.resolve(process.cwd(), filePath);
  const content = fs.readFileSync(realPath);
  const name = path.basename(realPath);

  return {
    name,
    content: content.toString(),
  };
}

export function getDirectoryContents(dirPath: string): DirectoryFile[] {
  const realPath = path.resolve(process.cwd(), dirPath);
  const fileNames = fs.readdirSync(dirPath);

  const files: DirectoryFile[] = [];

  for (const file of fileNames) {
    // ignore anything that isn't a JSON
    if (!file.endsWith('.json')) {
      continue;
    }

    const filePath = path.resolve(realPath, file);

    files.push(getFile(filePath));
  }

  return files;
}

export function writeFiles(dirPath: string, files: ResultFile[]): void {
  const jsonPath = path.resolve(process.cwd(), dirPath, 'json');
  const xlsxPath = path.resolve(process.cwd(), dirPath, 'xlsx');

  for (const file of files) {
    fs.writeFileSync(path.resolve(jsonPath, `${file.name}.json`), file.content);
    fs.writeFileSync(path.resolve(xlsxPath, `${file.name}.xlsx`), file.buffer);
  }
}

export function resetDir(dirPath: string): void {
  const realPath = path.resolve(process.cwd(), dirPath);

  if (fs.existsSync(realPath)) {
    fs.rmSync(realPath, { recursive: true, force: true });
  }

  fs.mkdirSync(path.resolve(realPath, 'json'), { recursive: true });
  fs.mkdirSync(path.resolve(realPath, 'xlsx'), { recursive: true });
} 
