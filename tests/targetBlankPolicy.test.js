import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanWithRules } from '../src/core/scannerUtils.js';
import { sourceSlopRules } from '../src/scanners/sourceSlopScanner.js';
import { SourceFixEngine } from '../src/core/sourceFixEngine.js';

function scan(source) {
  const dir = mkdtempSync(join(tmpdir(), 'unslop-target-blank-'));
  try {
    const src = join(dir, 'src');
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, 'Link.jsx'), source, 'utf8');
    return scanWithRules(src, sourceSlopRules);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('target=_blank without explicit rel is not reported as a blocker', () => {
  const findings = scan('<a href="https://example.com" target="_blank">Docs</a>');
  assert.ok(!findings.some((finding) => finding.rule === 'target-blank-without-rel'));
});

test('source repair does not add rel policy to target=_blank links without findings', () => {
  const input = '<a href="https://example.com" target="_blank">Docs</a>';
  const result = new SourceFixEngine('/tmp').applyFixes('src/Link.jsx', input, []);
  assert.equal(result.content, input);
  assert.ok(!result.fixes.some((fix) => fix.findingId === 'target-blank-without-rel'));
});

test('legacy target-blank findings no longer authorize source mutation', () => {
  const input = '<a href="https://example.com" target="_blank" rel="external">Docs</a>';
  const result = new SourceFixEngine('/tmp').applyFixes(
    'src/Link.jsx',
    input,
    [{ rule: 'target-blank-without-rel' }]
  );
  assert.equal(result.content, input);
  assert.equal(result.fixes.length, 0);
});
