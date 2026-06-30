import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanWithRules } from '../src/core/scannerUtils.js';
import { sourceSlopRules } from '../src/scanners/sourceSlopScanner.js';

function withFixture(source, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'unslop-source-'));
  try {
    const src = join(dir, 'src');
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, 'Component.jsx'), source, 'utf8');
    return fn(src);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('source slop scanner catches unstable keys and missing focus treatment', () => {
  withFixture(`
    export function Component({ items }) {
      return <div>{items.map(item => <button key={Math.random()} className="outline-none"><svg /></button>)}</div>;
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    const rules = findings.map((finding) => finding.rule);
    assert.ok(rules.includes('unstable-random-key'));
    assert.ok(rules.includes('outline-none-without-focus-visible'));
  });
});

test('source slop scanner catches placeholder content and visual slop signals', () => {
  withFixture(`
    export function Hero() {
      return <section className="bg-gradient-to-br from-purple-500 to-pink-500 backdrop-blur shadow-2xl transition-all">Acme Corp</section>;
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    const rules = findings.map((finding) => finding.rule);
    assert.ok(rules.includes('sample-data-shipping-risk'));
    assert.ok(rules.includes('generic-ai-aesthetic-stack'));
    assert.ok(rules.includes('transition-all-animation-slop'));
  });
});
