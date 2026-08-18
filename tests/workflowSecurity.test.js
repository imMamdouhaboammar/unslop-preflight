import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const workflowsDir = join(process.cwd(), '.github', 'workflows');
const externalUsePattern = /^\s*uses:\s*([^./\s][^@\s]*)@([^\s#]+)(?:\s+#\s*(.+))?\s*$/gm;
const fullShaPattern = /^[0-9a-f]{40}$/i;

function externalUses() {
  const entries = [];
  for (const filename of readdirSync(workflowsDir).filter((name) => /\.ya?ml$/i.test(name)).sort()) {
    const content = readFileSync(join(workflowsDir, filename), 'utf8');
    for (const match of content.matchAll(externalUsePattern)) {
      entries.push({ filename, target: match[1], ref: match[2], comment: match[3] || '' });
    }
  }
  return entries;
}

test('external GitHub Actions and reusable workflows are pinned to full commit SHAs', () => {
  const entries = externalUses();
  assert.ok(entries.length > 0, 'expected at least one external uses: entry');

  const mutable = entries.filter(({ ref }) => !fullShaPattern.test(ref));
  assert.deepEqual(
    mutable,
    [],
    `mutable workflow references found:\n${mutable.map(({ filename, target, ref }) => `${filename}: ${target}@${ref}`).join('\n')}`
  );
});

test('every immutable pin keeps reviewable source metadata in an inline comment', () => {
  const missingComments = externalUses().filter(({ ref, comment }) => fullShaPattern.test(ref) && !comment.trim());
  assert.deepEqual(
    missingComments,
    [],
    `pins missing source metadata comments:\n${missingComments.map(({ filename, target, ref }) => `${filename}: ${target}@${ref}`).join('\n')}`
  );
});
