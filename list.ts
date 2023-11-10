import chalk from "chalk";

import transformer from "./scripts/transformer";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function prettifyTransformer(key: string): string {
  const tokens = key.split(".");
  if (tokens.length === 1) {
    return capitalize(tokens[0]);
  }

  const clientName = capitalize(tokens[0]);
  const document = tokens[1]
    .split("-")
    .map((t) => capitalize(t))
    .join(" ");

  return `${clientName} - ${document}`;
}

export function listTransformer() {
  const transformers = Object.keys(transformer);

  console.info(chalk.cyan(`Found ${transformers.length} transformer(s):`));

  for (const transformFn of transformers) {
    console.info(
      chalk.cyan(`➜ ${prettifyTransformer(transformFn)} (${transformFn})`)
    );
  }
}
