import test from 'node:test';
import assert from 'node:assert';
import { listStandardsPacks, loadStandardsPack } from '../src/core/standardsPacks.js';

test('Standards Pack Registry - listStandardsPacks', () => {
  const packs = listStandardsPacks();
  assert.ok(Array.isArray(packs), 'listStandardsPacks should return an array');
  
  // Verify vibe-coding is found in the list
  const vibeCoding = packs.find(p => p.id === 'vibe-coding');
  assert.ok(vibeCoding, 'vibe-coding standards pack should be registered');
  assert.strictEqual(vibeCoding.name, 'Vibe Coding Standards Pack');
  assert.strictEqual(vibeCoding.risk, 'opinionated');
  assert.ok(Array.isArray(vibeCoding.categories), 'Manifest should contain categories array');
});

test('Standards Pack Registry - loadStandardsPack valid', () => {
  const { manifest, rules } = loadStandardsPack('vibe-coding');
  assert.ok(manifest, 'Should load manifest');
  assert.strictEqual(manifest.id, 'vibe-coding');
  assert.strictEqual(manifest.name, 'Vibe Coding Standards Pack');
  
  assert.ok(rules, 'Should load rules');
  assert.ok(rules.architecture, 'Should load architecture category rules');
  assert.ok(rules.security, 'Should load security category rules');
  assert.ok(rules['component-modularity'], 'Should load component modularity rules');
  assert.ok(rules['type-system'], 'Should load type system rules');
  assert.ok(rules.testing, 'Should load testing rules');
  assert.ok(rules.accessibility, 'Should load accessibility rules');
  
  assert.strictEqual(rules.architecture.ruleSetName, 'Vibe Coding Unidirectional Dependency Architecture Rules');
});

test('Standards Pack Registry - loadStandardsPack errors', () => {
  // Loading a non-existent pack should throw
  assert.throws(() => {
    loadStandardsPack('non-existent-pack');
  }, /Standards pack "non-existent-pack" not found/);

  // Loading with invalid/null input should throw
  assert.throws(() => {
    loadStandardsPack(null);
  }, /Invalid standards pack ID/);

  assert.throws(() => {
    loadStandardsPack(123);
  }, /Invalid standards pack ID/);
});
