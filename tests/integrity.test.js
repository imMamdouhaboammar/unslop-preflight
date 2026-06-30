import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyScoringIntegrity } from '../src/core/integrity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scoringPath = join(__dirname, '../src/core/scoring.js');

test('verifyScoringIntegrity passes on clean scoring.js and throws when tampered', () => {
  // 1. Should pass on clean file
  assert.doesNotThrow(() => {
    verifyScoringIntegrity();
  });

  // 2. Read original content
  const originalContent = readFileSync(scoringPath, 'utf8');

  try {
    // 3. Tamper with scoring.js
    const tamperedContent = originalContent + '\n// Tampered comment to bypass rules';
    writeFileSync(scoringPath, tamperedContent, 'utf8');

    // 4. Should throw anti-tamper exception
    assert.throws(() => {
      verifyScoringIntegrity();
    }, /Anti-tamper triggered/);

  } finally {
    // 5. Restore clean file
    writeFileSync(scoringPath, originalContent, 'utf8');
  }

  // 6. Should pass again after restore
  assert.doesNotThrow(() => {
    verifyScoringIntegrity();
  });
});
