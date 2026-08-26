import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceFixEngine } from '../src/core/sourceFixEngine.js';

const source = '<button className="toolbar">Open</button>';

test('source fixer does not mutate when findings are omitted', () => {
  const engine = new SourceFixEngine('/tmp');
  const result = engine.applyFixes('Toolbar.jsx', source);

  assert.equal(result.content, source);
  assert.deepEqual(result.fixes, []);
});

test('source fixer does not treat an empty findings array as authority to run every fixer', () => {
  const engine = new SourceFixEngine('/tmp');
  const result = engine.applyFixes('Toolbar.jsx', source, []);

  assert.equal(result.content, source);
  assert.deepEqual(result.fixes, []);
});

test('explicit matching finding still authorizes its bounded repair', () => {
  const engine = new SourceFixEngine('/tmp');
  const result = engine.applyFixes('Toolbar.jsx', source, [{ rule: 'missing-button-type' }]);

  assert.match(result.content, /type="button"/);
  assert.equal(result.fixes.length, 1);
  assert.equal(result.fixes[0].findingId, 'missing-button-type');
});
