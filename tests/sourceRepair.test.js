import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SourceFixEngine, runSourceFixEngine } from '../src/core/sourceFixEngine.js';
import { SafetyValidator } from '../src/core/safetyValidator.js';
import { detectPackageManager, isSafeCommand, runVerification } from '../src/core/verify.js';
import { getRepairMode } from '../src/core/autopilotPlan.js';

function tempDir() {
  return mkdtempSync(join(tmpdir(), 'unslop-tests-'));
}

test('SourceFixEngine - target="_blank" rel noopener noreferrer fixer', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<div><a href="https://google.com" target="_blank">Google</a></div>';
  const { content: result } = engine.applyFixes('test.jsx', content, [{ rule: 'target-blank-without-rel' }]);
  assert.match(result, /rel="noopener noreferrer"/);
  const contentWithRel = '<div><a href="https://google.com" target="_blank" rel="nofollow">Google</a></div>';
  const { content: resultWithRel } = engine.applyFixes('test.jsx', contentWithRel, [{ rule: 'target-blank-without-rel' }]);
  assert.equal(resultWithRel, '<div><a href="https://google.com" target="_blank" rel="nofollow noopener">Google</a></div>');
  const firstPass = engine.applyFixes('test.jsx', content, [{ rule: 'target-blank-without-rel' }]).content;
  const secondPass = engine.applyFixes('test.jsx', firstPass, [{ rule: 'target-blank-without-rel' }]).content;
  assert.equal(firstPass, secondPass);
});

test('SourceFixEngine - missing button type fixer', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<div><button className="btn">Click me</button></div>';
  const { content: result } = engine.applyFixes('test.jsx', content, [{ rule: 'missing-button-type' }]);
  assert.match(result, /type="button"/);
  const contentWithType = '<div><button type="submit" className="btn">Submit</button></div>';
  const { content: resultWithType } = engine.applyFixes('test.jsx', contentWithType, [{ rule: 'missing-button-type' }]);
  assert.equal(resultWithType, contentWithType);
  const contentSubmit = '<div><button className="btn">Submit form</button></div>';
  const { content: resultSubmit } = engine.applyFixes('test.jsx', contentSubmit, [{ rule: 'missing-button-type' }]);
  assert.equal(resultSubmit, contentSubmit);
  const contentForm = '<form><div><button>Save</button></div></form>';
  const { content: resultForm } = engine.applyFixes('test.jsx', contentForm, [{ rule: 'missing-button-type' }]);
  assert.equal(resultForm, contentForm);
});

test('SourceFixEngine - image loading="lazy" fixer', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<div><img src="avatar.png" /></div>';
  const { content: result } = engine.applyFixes('test.jsx', content, [{ rule: 'image-without-loading' }]);
  assert.match(result, /loading="lazy"/);
  const contentNext = 'import Image from "next/image";\n<div><Image src="avatar.png" /></div>';
  const { content: resultNext } = engine.applyFixes('test.jsx', contentNext, [{ rule: 'image-without-loading' }]);
  assert.equal(resultNext, contentNext);
  const contentHero = '<div><img src="hero.png" priority="high" /></div>';
  const { content: resultHero } = engine.applyFixes('test.jsx', contentHero, [{ rule: 'image-without-loading' }]);
  assert.equal(resultHero, contentHero);
});

test('SourceFixEngine - alt="" on decorative images fixer', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<div><img src="/icons/checkmark.svg" /></div>';
  const { content: result } = engine.applyFixes('test.jsx', content, [{ rule: 'image-without-alt' }]);
  assert.match(result, /alt=""/);
  const contentNormal = '<div><img src="/photos/scenery.jpg" /></div>';
  const { content: resultNormal } = engine.applyFixes('test.jsx', contentNormal, [{ rule: 'image-without-alt' }]);
  assert.equal(resultNormal, contentNormal);
});

test('SourceFixEngine - transition-all mapping fixer', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = 'const B = () => <div className="transition-all bg-blue-500 hover:bg-blue-600 text-white">X</div>';
  const { content: result } = engine.applyFixes('test.jsx', content, [{ rule: 'transition-all-animation-slop' }]);
  assert.match(result, /transition-colors/);
  assert.doesNotMatch(result, /transition-all/);
  const contentTransform = 'const B = () => <div className="transition-all scale-105 hover:scale-110">X</div>';
  const { content: resultTransform } = engine.applyFixes('test.jsx', contentTransform, [{ rule: 'transition-all-animation-slop' }]);
  assert.match(resultTransform, /transition-transform/);
  const contentComplex = 'const B = () => <div className="transition-all bg-blue-500 scale-105 hover:scale-110 hover:bg-blue-600">X</div>';
  const { content: resultComplex } = engine.applyFixes('test.jsx', contentComplex, [{ rule: 'transition-all-animation-slop' }]);
  assert.equal(resultComplex, contentComplex);
});

test('SourceFixEngine - focus-visible outline-none fixer', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = 'const B = () => <button className="outline-none bg-blue-500 p-2">Click</button>';
  const { content: result } = engine.applyFixes('test.jsx', content, [{ rule: 'outline-none-without-focus-visible' }]);
  assert.match(result, /focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-500/);
  const contentUnknown = 'const B = () => <button className="outline-none simple-btn">Click</button>';
  const { content: resultUnknown } = engine.applyFixes('test.jsx', contentUnknown, [{ rule: 'outline-none-without-focus-visible' }]);
  assert.equal(resultUnknown, contentUnknown);
});

test('SourceFixEngine - console.log remover', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = 'function test() {\n  console.log("hello");\n  return 1;\n}';
  const { content: result } = engine.applyFixes('src/utils.js', content, [{ rule: 'console-log-in-source' }]);
  assert.equal(result.replace(/\s+/g, ''), 'functiontest(){return1;}');
  const contentComment = 'function test() {\n  // console.log("debug");\n  console.log(process.env.NODE_ENV); // debug\n  return 1;\n}';
  const { content: resultComment } = engine.applyFixes('src/utils.js', contentComment, [{ rule: 'console-log-in-source' }]);
  assert.equal(resultComment, contentComment);
  const contentInTest = 'function test() {\n  console.log("hello");\n  return 1;\n}';
  const { content: resultInTest } = engine.applyFixes('tests/utils.test.js', contentInTest, [{ rule: 'console-log-in-source' }]);
  assert.equal(resultInTest, contentInTest);
});

test('SafetyValidator - limits and path restrictions', () => {
  const root = tempDir();
  const validator = new SafetyValidator(root, { maxFixFiles: 2, maxFixLines: 20, maxLinesPerFile: 10 });
  assert.equal(validator.validateFile('src/index.js').valid, true);
  assert.equal(validator.validateFile('src/components/Button.tsx').valid, true);
  const nm = validator.validateFile('node_modules/react/index.js');
  assert.equal(nm.valid, false);
  assert.match(nm.reason, /node_modules/);
  const env = validator.validateFile('.env');
  assert.equal(env.valid, false);
  assert.match(env.reason, /\.env/);
  const lock = validator.validateFile('package-lock.json');
  assert.equal(lock.valid, false);
  assert.match(lock.reason, /lockfile/);
  const traversal = validator.validateFile('../outside.js');
  assert.equal(traversal.valid, false);
  assert.match(traversal.reason, /outside the project root/);
  const patches = [{ filePath: 'src/file1.js', addedLines: 15, removedLines: 0 }];
  const patchCheck = validator.validatePatches(patches);
  assert.equal(patchCheck.valid, false);
  assert.ok(patchCheck.reasons[0].includes('exceeding the limit of 10 changed lines per file'));
});

test('runSourceFixEngine validates changed lines, not total file length', () => {
  const root = tempDir();
  const file = join(root, 'large.jsx');
  const filler = Array.from({ length: 80 }, (_, index) => `const value${index} = ${index};`);
  const original = [...filler, '<a href="/docs" target="_blank">Docs</a>', ''].join('\n');
  writeFileSync(file, original);

  const result = runSourceFixEngine(root, [{ file: 'large.jsx', rule: 'target-blank-without-rel' }], {
    safe: true,
    maxLinesPerFile: 4,
    maxFixLines: 4
  });

  assert.equal(result.failed.length, 0);
  assert.equal(result.applied.length, 1);
  assert.match(readFileSync(file, 'utf8'), /rel="noopener noreferrer"/);
});

test('Verify Loop - Package Manager Detection and Script validation', () => {
  const root = tempDir();
  writeFileSync(join(root, 'package-lock.json'), '{}');
  assert.equal(detectPackageManager(root), 'npm');
  writeFileSync(join(root, 'pnpm-lock.yaml'), '');
  assert.equal(detectPackageManager(root), 'pnpm');
  assert.equal(isSafeCommand('test', 'npm run test'), true);
  assert.equal(isSafeCommand('dev', 'next dev'), false);
  assert.equal(isSafeCommand('clean', 'rm -rf dist'), false);
});

test('Repair mode argument helper', () => {
  assert.equal(getRepairMode({ 'plan-only': true }), 'plan-only');
  assert.equal(getRepairMode({ planOnly: true }), 'plan-only');
  assert.equal(getRepairMode({ 'safe-fix': true }), 'safe-fix');
  assert.equal(getRepairMode({ safeFix: true }), 'safe-fix');
  assert.equal(getRepairMode({ 'agent-fix': true }), 'agent-fix');
  assert.equal(getRepairMode({ agentFix: true }), 'agent-fix');
  assert.equal(getRepairMode({ 'doc-fix': true }), 'doc-fix');
  assert.equal(getRepairMode({ docFix: true }), 'doc-fix');
  assert.equal(getRepairMode({}), 'doc-fix');
});
