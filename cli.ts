#!/usr/bin/env node
import cac from "cac";

import { transformOutput } from "./main";
import { listTransformer } from "./list";

const cli = cac();

cli
  .command(
    "<source_path> [format]",
    "Convert a post-processing output file to sheet with the pre-defined format"
  )
  .option("-o, --out <path>", "Output directory path", { default: "out" })
  .action(transformOutput);
cli
  .command("list", "Display a list of available transfomer")
  .action(listTransformer);

cli.help();
cli.version("1.0.0");

try {
  cli.parse();
} catch (err) {
  console.error(err.message);
}
