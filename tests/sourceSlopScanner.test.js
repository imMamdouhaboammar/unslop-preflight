import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanWithRules } from '../src/core/scannerUtils.js';
import { sourceSlopRules } from '../src/scanners/sourceSlopScanner.js';

function withFixture(source, fn, filename = 'Component.jsx') {
  const dir = mkdtempSync(join(tmpdir(), 'unslop-source-'));
  try {
    const src = join(dir, 'src');
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, filename), source, 'utf8');
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

test('source slop scanner catches unsafe target blank links and missing autocomplete', () => {
  withFixture(`
    export function Signup() {
      return <form><a href="https://example.com" target="_blank">Docs</a><input type="email" /></form>;
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('target-blank-without-rel'));
    assert.ok(rules.includes('input-without-autocomplete-review'));
  });
});

test('scanner rule file exclusions prevent token false positives', () => {
  withFixture(`
    export const colors = { brand: '#ff5500' };
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    assert.ok(!ruleNames(findings).includes('hardcoded-color-token-drift'));
  }, 'theme.ts');
});

test('source slop scanner catches brain icons, sparkle icons, and raw emojis in source', () => {
  withFixture(`
    export function AIWidgets() {
      return (
        <div>
          <h3>AI Brain 🧠</h3>
          <p>Get instant answers ✨</p>
          <Brain className="lucide-brain" />
          <SparklesIcon />
          <p>Some happy faces 😊 for users</p>
        </div>
      );
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('no-brain-icons-source'));
    assert.ok(rules.includes('no-sparkle-icons-source'));
    assert.ok(rules.includes('no-emojis-source'));
  });
});

test('source slop scanner triggers sidebar heuristics on files/contents matching sidebar', () => {
  // Test a sidebar component with viewport clipping, lack of scrolling, and missing active states
  withFixture(`
    export function MainSidebar() {
      return (
        <aside className="h-screen bg-slate-900 text-white">
          <nav>
            <a href="/home">Home</a>
            <a href="/settings">Settings</a>
          </nav>
        </aside>
      );
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('sidebar-viewport-clipping'));
    assert.ok(rules.includes('sidebar-missing-overflow'));
    assert.ok(rules.includes('sidebar-missing-active-state'));
  }, 'Sidebar.jsx');
});

test('source slop scanner passes sidebar heuristics on a properly designed sidebar', () => {
  withFixture(`
    export function ResponsiveSidebar() {
      return (
        <aside className="min-h-dvh overflow-y-auto bg-slate-900 text-white">
          <nav>
            <a href="/home" aria-current="page" className="active">Home</a>
            <a href="/settings">Settings</a>
          </nav>
        </aside>
      );
    }
  `, (src) => {
    const findings = scanWithRules(src, sourceSlopRules);
    const rules = ruleNames(findings);
    assert.ok(!rules.includes('sidebar-viewport-clipping'));
    assert.ok(!rules.includes('sidebar-missing-overflow'));
    assert.ok(!rules.includes('sidebar-missing-active-state'));
  }, 'Sidebar.jsx');
});

