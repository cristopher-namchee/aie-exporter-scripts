# GLAIR - Paperless Sheetformer

A simple CLI app to transform OCR data to sheet. Meant to be used by AIE for testing purposes.

## Installation

> Ensure that you have Node v16 or later installed on your machine!

Download the latest binary of `sheetformer` from the release menu.

## Usage

```bash
sheetformer

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

> If a desired transformer format isn't available, the default transformer will be used instead.

## Extending Transformers

You can extend transformers by exposing a default export that implements this interface:

```typescript
type ExportFn = (response: OCRResponse, documentName: string) => Promise<Buffer>;
```

And register the new transformer in [`scripts/transformer.ts`](./scripts/transformer.ts), for example:

```typescript
import defaultScript from "./default";

import yourCustomTransformer from "path/to/transformer";

export default {
  default: defaultScript,

  "client.document": yourCustomTransformer,
};

```

### Transformer Conventions

1. Transformer should be grouped by folder that are named by client name in lowercase.
2. Document transformer should be named in the following pattern `<document-name>.ts` in kebab-case.

For example, a Bank Statement transformer for client named ACME should be stored in `scripts/acme/bank-statement.ts`

## License

This project is licensed under the [MIT License](./LICENSE)
