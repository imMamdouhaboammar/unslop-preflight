import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initReviewRound, getPendingComments } from '../src/core/reviewRecorder.js';
import fs from 'node:fs';
import path from 'node:path';

test('reviewRecorder initializes .agent-review directory and tracks rounds', () => {
  const tmpDir = path.join(process.cwd(), '.test-agent-review');
  const round = initReviewRound({ url: 'http://localhost:3000', reviewDir: tmpDir });
  assert.ok(round.roundId);
  assert.ok(fs.existsSync(tmpDir));
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
