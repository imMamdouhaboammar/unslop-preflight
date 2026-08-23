import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanWithRules } from '../src/core/scannerUtils.js';
import { sourceSlopRules } from '../src/scanners/sourceSlopScanner.js';

function scanFixture(source) {
  const dir = mkdtempSync(join(tmpdir(), 'unslop-target-blank-'));
  try {
    const src = join(dir, 'src');
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, 'Links.jsx'), source, 'utf8');
    return scanWithRules(src, sourceSlopRules);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function findingsFor(source, rule) {
  return scanFixture(source).filter((finding) => finding.rule === rule);
}

test('target blank without explicit rel is informational in modern browsers', () => {
  const findings = findingsFor(
    '<a href="https://example.com" target="_blank">Docs</a>',
    'target-blank-without-rel'
  );

  assert.equal(findings.length, 1);
  assert.equal(findings[0].level, 'info');
});

test('target blank with explicit opener remains a blocker', () => {
  const findings = findingsFor(
    '<a href="https://example.com" target="_blank" rel="external opener">Docs</a>',
    'target-blank-with-explicit-opener'
  );

  assert.equal(findings.length, 1);
  assert.equal(findings[0].level, 'blocker');
});

test('explicit noopener does not trigger target blank policy findings', () => {
  const findings = scanFixture(
    '<a href="https://example.com" target="_blank" rel="external noopener">Docs</a>'
  );
  const targetBlankFindings = findings.filter((finding) => finding.rule.startsWith('target-blank-'));

  assert.deepEqual(targetBlankFindings, []);
});

test('opener token matching does not treat unrelated rel tokens as opener', () => {
  const findings = findingsFor(
    '<a href="https://example.com" target="_blank" rel="developer">Docs</a>',
    'target-blank-with-explicit-opener'
  );

  assert.equal(findings.length, 0);
});
