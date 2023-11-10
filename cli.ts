#!/usr/bin/env node
import cac from "cac";

import { transformOutput } from "./main";

const cli = cac();

cli
  .command(
    "<source_path> [format]",
    "Convert a post-processing output file to sheet with the pre-defined format"
  )
  .option("-o, --out <path>", "Output directory path", { default: "out" })
  .action(transformOutput);

cli.help();

try {
  cli.parse();
} catch (err) {
  console.error(err.message);
}
