import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanWithRules } from '../src/core/scannerUtils.js';
import { vibeCodingRules } from '../src/scanners/standardsPackScanner.js';

function withFixture(source, fn, filename = 'Component.jsx', subDir = 'src/components') {
  const dir = mkdtempSync(join(tmpdir(), 'unslop-standards-'));
  try {
    const src = join(dir, subDir);
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, filename), source, 'utf8');
    return fn(join(dir, 'src'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function ruleNames(findings) {
  return findings.map((finding) => finding.rule);
}

test('standards pack scanner - components-importing-pages', () => {
  withFixture(`
    import React from 'react';
    import { MyPage } from '@/pages/MyPage';
    export function SimpleButton() {
      return <button>Click</button>;
    }
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('components-importing-pages'), 'Should catch component importing from pages');
  }, 'SimpleButton.jsx', 'src/components');

  // Should NOT trigger if not in components folder
  withFixture(`
    import React from 'react';
    import { MyPage } from '@/pages/MyPage';
    export function AnotherPage() {
      return <div>Page</div>;
    }
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(!rules.includes('components-importing-pages'), 'Should NOT catch importing pages when outside of components folder');
  }, 'AnotherPage.jsx', 'src/pages');
});

test('standards pack scanner - component-max-lines soft and hard limits', () => {
  // Test short file (no trigger)
  withFixture(`
    export function ShortComponent() {
      return <p>Short</p>;
    }
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(!rules.includes('component-max-lines'), 'Short component should not trigger size limit');
  }, 'ShortComponent.jsx', 'src/components');

  // Test soft warning (151 lines)
  const softSource = 'export function SoftComponent() {\n  return <div />;\n}\n' + '// filler\n'.repeat(150);
  withFixture(softSource, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('component-max-lines'), 'Should trigger component-max-lines warning');
    const warning = findings.find(f => f.rule === 'component-max-lines');
    assert.strictEqual(warning.level, 'warning', 'Should be warning severity for 151 lines');
  }, 'SoftComponent.jsx', 'src/components');

  // Test hard blocker (251 lines)
  const hardSource = 'export function HardComponent() {\n  return <div />;\n}\n' + '// filler\n'.repeat(250);
  withFixture(hardSource, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('component-max-lines'), 'Should trigger component-max-lines blocker');
    const blocker = findings.find(f => f.rule === 'component-max-lines');
    assert.strictEqual(blocker.level, 'blocker', 'Should be blocker severity for 251 lines');
  }, 'HardComponent.jsx', 'src/components');
});

test('standards pack scanner - raw-local-storage-usage', () => {
  withFixture(`
    export function TokenHandler() {
      const token = window.localStorage.getItem('token');
      return <div>{token}</div>;
    }
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('raw-local-storage-usage'), 'Should catch raw localStorage use');
  });

  // Should skip in storageManager utility
  withFixture(`
    export class StorageManager {
      static get(key) {
        return localStorage.getItem(key);
      }
    }
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(!rules.includes('raw-local-storage-usage'), 'Should exclude storageManager file from local storage checks');
  }, 'storageManager.js');
});

test('standards pack scanner - no-ts-ignore', () => {
  withFixture(`
    // @ts-ignore
    const untypedValue: any = 'test';
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('no-ts-ignore'), 'Should catch @ts-ignore comment block');
  });
});

test('standards pack scanner - hardcoded-secret-keys', () => {
  withFixture(`
    const config = {
      apiKey: 'api-key-value-12345678901234567890'
    };
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(rules.includes('hardcoded-secret-keys'), 'Should catch hardcoded secret key');
  });

  // Should skip in test files
  withFixture(`
    const testSecret = 'mock-api-key-abcdefghijklmnopqrstuvwxyz';
  `, (src) => {
    const findings = scanWithRules(src, vibeCodingRules);
    const rules = ruleNames(findings);
    assert.ok(!rules.includes('hardcoded-secret-keys'), 'Should skip secret scanning in test files');
  }, 'Component.test.jsx');
});
