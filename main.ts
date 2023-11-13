import ora from "ora";
import chalk from "chalk";

import {
  getDirectoryContents,
  getFile,
  isDir,
  resetDir,
  writeFiles,
} from "./fs";

import type { DirectoryFile, OCRResponse, ResultFile } from "./types";

import { ExportFn } from "./types";

import transformer from "./scripts/transformer";

function toDotNotation(str: string): string {
  return str.replace(/\//gi, ".");
}

function getTransformerFunction(identifier: string): [ExportFn, boolean] {
  const objIdentifier = toDotNotation(identifier ?? "");
  if (transformer[objIdentifier]) {
    return [transformer[objIdentifier], true];
  }

  return [transformer["default"], false];
}

export async function transformOutput(path: string, format: string, options) {
  const spinner = ora("Processing files...").start();
  console.log();

  try {
    const isDirectory = isDir(path);

    console.info(
      chalk.cyan(
        `💡 Source path is a ${
          isDirectory ? "directory, executing bulk transformation." : "file"
        }`
      )
    );

    const outPath = (options.o || options.out) as string;

    const [script, exist] = getTransformerFunction(format);
    console.info(
      chalk.cyan(
        exist
          ? "💡 Custom client script exist, using custom transformer."
          : "💡 Custom client script does not exist. Reverting to default transformer."
      )
    );

    const files: DirectoryFile[] = [];

    resetDir(outPath);

    if (isDirectory) {
      files.push(...getDirectoryContents(path));
    } else {
      files.push(getFile(path));
    }

    spinner.text = `Transforming ${files.length} file(s) to sheet...`;

    const promises: Promise<ResultFile>[] = files.map(async (file) => {
      const xlsBuffer = await script(
        JSON.parse(file.content) as OCRResponse,
        file.name
      );

      return {
        ...file,
        buffer: xlsBuffer,
      };
    });

    const results = await Promise.all(promises);

    spinner.text = `Writing transformation result to output directory...`;

    writeFiles(outPath, results);

    spinner.succeed(
      `Successfully transformed ${files.length} file(s) to sheet`
    );
  } catch (err) {
    spinner.fail(`Failed to execute transformer: ${err.message}`);
  }
}
