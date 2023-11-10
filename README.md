# GLAIR - Paperless Sheetformer

A simple CLI app to transform OCR data to sheet. Meant to be used by AIE for testing purposes.

## Installation

> Ensure that you have Node v16 or later installed on your machine!

Download the latest binary of `sheetformer` from the release menu.

## Usage

```bash
sheetformer/1.0.0

Usage:
  $ sheetformer <source_path> [format]

Commands:
  <source_path> [format]  Convert a post-processing output file to sheet with the pre-defined format
  list                    Display a list of available transfomer

For more info, run any command with the `--help` flag:
  $ sheetformer --help
  $ sheetformer list --help

Options:
  -o, --out <path>  Output directory path (default: out)
  -h, --help        Display this message 
  -v, --version     Display version number
```

## Extending Transformers
