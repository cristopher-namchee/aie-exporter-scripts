import { ExportFn } from './typedef';

import scripts from './scripts/resolver';

function toDotNotation(str: string): string {
  return str.replace(/\//gi, '.');
}

export function getTransformerFunction(
  identifier: string
): ExportFn {
  const objIdentifier = toDotNotation(identifier);

  return scripts[objIdentifier] ?? scripts['default'];
}

