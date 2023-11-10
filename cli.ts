#!/usr/bin/env node
import cac from 'cac';

import { getDirectoryContents, getFile, isDir, resetDir, writeFiles } from './fs';
import { getTransformerFunction } from './scripts';

import type { DirectoryFile, OCRResponse, ResultFile } from './typedef';

const cli = cac();

cli
  .command(
    '<path> [format]',
    'Convert a post-processing output file to sheet with the pre-defined format',
  )
  .option('-o, --out <path>', 'Output directory path', { default: 'out' })
  .action(async (path, format, options) => {
    const isDirectory = isDir(path);
    const outPath = (options.o || options.out) as string;

    const script = getTransformerFunction(format);
    const files: DirectoryFile[] = [];

    resetDir(outPath);

    if (isDirectory) {
      files.push(...getDirectoryContents(path));
    } else {
      files.push(getFile(path));
    }

    const promises: Promise<ResultFile>[] = files.map(async (file) => {
      const xlsBuffer = await script(JSON.parse(file.content) as OCRResponse, file.name);

      return {
        ...file,
        buffer: xlsBuffer,
      };
    });

    const results = await Promise.all(promises);

    writeFiles(outPath, results);
  });

cli.help();
cli.parse();
