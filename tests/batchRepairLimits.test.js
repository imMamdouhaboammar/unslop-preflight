import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runSourceFixEngine } from '../src/core/sourceFixEngine.js';

function tempDir() {
  return mkdtempSync(join(tmpdir(), 'unslop-batch-limits-'));
}

function seedButtonFiles(root) {
  const files = ['One.jsx', 'Two.jsx'];
  for (const file of files) {
    writeFileSync(join(root, file), '<button>Open</button>\n', 'utf8');
  }
  return files;
}

function findingsFor(files) {
  return files.map((file) => ({
    rule: 'missing-button-type',
    file,
    excerpt: '<button>Open</button>'
  }));
}

test('safe repair fails closed when the batch exceeds maxFixFiles', () => {
  const root = tempDir();
  const files = seedButtonFiles(root);

  const result = runSourceFixEngine(root, findingsFor(files), {
    safeFix: true,
    maxFixFiles: 1,
    maxFixLines: 100,
    maxLinesPerFile: 10
  });

  assert.equal(result.applied.length, 0);
  assert.equal(readFileSync(join(root, files[0]), 'utf8'), '<button>Open</button>\n');
  assert.equal(readFileSync(join(root, files[1]), 'utf8'), '<button>Open</button>\n');
});

test('safe repair fails closed when aggregate changed lines exceed maxFixLines', () => {
  const root = tempDir();
  const files = seedButtonFiles(root);

  const result = runSourceFixEngine(root, findingsFor(files), {
    safeFix: true,
    maxFixFiles: 10,
    maxFixLines: 2,
    maxLinesPerFile: 10
  });

  assert.equal(result.applied.length, 0);
  assert.equal(readFileSync(join(root, files[0]), 'utf8'), '<button>Open</button>\n');
  assert.equal(readFileSync(join(root, files[1]), 'utf8'), '<button>Open</button>\n');
});
