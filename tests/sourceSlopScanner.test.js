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

function ruleNames(findings) {
  return findings.map((finding) => finding.rule);
}

test('source slop scanner catches unstable keys and missing focus treatment', () => {
  withFixture(`
    export function Component({ items }) {
      return <div>{items.map(item => <button key={Math.random()} className="outline-none"><svg /></button>)}</div>;
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    const rules = ruleNames(findings);
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
    const rules = ruleNames(findings);
    assert.ok(rules.includes('sample-data-shipping-risk'));
    assert.ok(rules.includes('generic-ai-aesthetic-stack'));
    assert.ok(rules.includes('transition-all-animation-slop'));
  });
});

test('file-scoped scanner does not flag collection with an empty state', () => {
  withFixture(`
    export function List({ items }) {
      if (items.length === 0) return <p>No data</p>;
      return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    assert.ok(!ruleNames(findings).includes('collection-map-empty-state-review'));
  });
});

test('file-scoped scanner does not flag motion with reduced-motion guard', () => {
  withFixture(`
    import { motion, useReducedMotion } from 'framer-motion';
    export function Card() {
      const reduceMotion = useReducedMotion();
      return <motion.div animate={reduceMotion ? false : { opacity: 1 }} />;
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    assert.ok(!ruleNames(findings).includes('motion-without-reduced-motion-review'));
  });
});
