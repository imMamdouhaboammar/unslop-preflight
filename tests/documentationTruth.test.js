import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

test('README describes the current deterministic text-rewrite repair architecture truthfully', () => {
  assert.doesNotMatch(readme, /repair[^\n|]*\bAST\b/i);
  assert.doesNotMatch(readme, /--safe-fix[^\n|]*\bAST\b/i);
  assert.match(readme, /repair[^\n|]*deterministic[^\n|]*text rewrites/i);
  assert.match(readme, /--safe-fix[^\n|]*deterministic[^\n|]*source rewrites/i);
});
