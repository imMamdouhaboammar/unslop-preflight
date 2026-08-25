import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

function tableRow(marker) {
  return readme.split(/\r?\n/).find((line) => line.includes(marker)) || '';
}

test('README describes the current deterministic text-rewrite repair architecture truthfully', () => {
  const repairRow = tableRow('| `repair` |');
  const safeFixRow = tableRow('| `--safe-fix` |');

  assert.doesNotMatch(repairRow, /\bAST\b/i);
  assert.match(repairRow, /\bdeterministic\b/i);
  assert.match(repairRow, /\bbounded\b/i);
  assert.match(repairRow, /\btext rewrites\b/i);

  assert.doesNotMatch(safeFixRow, /\bAST\b/i);
  assert.match(safeFixRow, /\bdeterministic\b/i);
  assert.match(safeFixRow, /\bbounded\b/i);
  assert.match(safeFixRow, /\bsource rewrites\b/i);
});
