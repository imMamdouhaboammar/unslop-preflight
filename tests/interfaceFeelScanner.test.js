import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanInterfaceFeel } from '../src/scanners/interfaceFeelScanner.js';

test('interfaceFeelScanner detects transition: all and non-concentric radius', () => {
  const code = `
    .btn { transition: all 0.2s ease; }
    .card { border-radius: 12px; padding: 16px; }
    .card .inner { border-radius: 12px; }
    .num { font-size: 24px; }
  `;

  const results = scanInterfaceFeel(code, 'style.css');
  assert.ok(results.findings.some(f => f.ruleId === 'never-transition-all'));
  assert.ok(results.findings.some(f => f.ruleId === 'concentric-border-radius'));
});
