import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanWithRules } from '../src/core/scannerUtils.js';
import { typographyRules } from '../src/scanners/typographyScanner.js';

const longArabicRule = typographyRules.filter((rule) => rule.name === 'long-arabic-text-height');
const arabic80 = 'ا'.repeat(80);
const arabic79 = 'ا'.repeat(79);
const arabic40 = 'ا'.repeat(40);

function scanMarkup(source, filename = 'Component.jsx') {
  const dir = mkdtempSync(join(tmpdir(), 'unslop-typography-'));
  try {
    const src = join(dir, 'src');
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, filename), source, 'utf8');
    return scanWithRules(src, longArabicRule).filter((finding) => finding.rule === 'long-arabic-text-height');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('detects exactly 80 direct Arabic characters regardless of class order', () => {
  const findings = scanMarkup(`<p className="leading-none text-center">${arabic80}</p>`);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 1);
});

test('detects multiline text-justify candidates and reports the opening tag line', () => {
  const findings = scanMarkup(`export function ArabicCopy() {
  return (
    <p
      data-kind="body"
      className="leading-none text-justify"
    >
      ${arabic80}
    </p>
  );
}`);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 3);
});

test('counts a simple HTML entity as one visible direct character', () => {
  const findings = scanMarkup(`<p class="leading-none text-center">${arabic79}&nbsp;</p>`, 'page.html');
  assert.equal(findings.length, 1);
});

test('does not flag 79 direct Arabic characters', () => {
  const findings = scanMarkup(`<p className="text-center leading-none">${arabic79}</p>`);
  assert.equal(findings.length, 0);
});

test('does not treat dir=rtl or long Latin copy as Arabic evidence', () => {
  const findings = scanMarkup(`<p dir="rtl" className="text-center leading-none">${'a'.repeat(100)}</p>`);
  assert.equal(findings.length, 0);
});

test('does not flag short Arabic copy or safer line-height', () => {
  const shortFindings = scanMarkup('<p className="text-center leading-none">نص عربي قصير</p>');
  const safeFindings = scanMarkup(`<p className="text-center leading-tight">${arabic80}</p>`);
  assert.equal(shortFindings.length, 0);
  assert.equal(safeFindings.length, 0);
});

test('does not combine class tokens or text across adjacent elements', () => {
  const findings = scanMarkup(`<div>
    <p className="leading-none">${arabic80}</p>
    <p className="text-center">${arabic80}</p>
  </div>`);
  assert.equal(findings.length, 0);
});

test('does not count nested child text toward the parent candidate', () => {
  const findings = scanMarkup(`<p className="leading-none text-center">قصير<span>${arabic80}</span></p>`);
  assert.equal(findings.length, 0);
});

test('does not count JSX expressions as direct visible text', () => {
  const findings = scanMarkup(`<p className="leading-none text-center">${arabic79}{label}</p>`);
  assert.equal(findings.length, 0);
});

test('matches exact utility tokens rather than lookalike class names', () => {
  const findings = scanMarkup(`<p className="foo-text-center leading-none-ish">${arabic80}</p>`);
  assert.equal(findings.length, 0);
});

test('counts direct text on both sides of a nested child without counting the child', () => {
  const findings = scanMarkup(`<p className="text-center leading-none">${arabic40}<span>${arabic80}</span>${arabic40}</p>`);
  assert.equal(findings.length, 1);
});

test('does not count nested JSX expression content as literal text', () => {
  const findings = scanMarkup(`<p className="text-center leading-none">${arabic79}{condition ? { label: 'ا' } : null}</p>`);
  assert.equal(findings.length, 0);
});

test('handles greater-than operators inside JSX attribute expressions', () => {
  const findings = scanMarkup(`<p onClick={() => value > 0} className="text-center leading-none">${arabic80}</p>`);
  assert.equal(findings.length, 1);
});

test('evaluates a nested candidate independently from its short parent', () => {
  const findings = scanMarkup(`<p className="text-center leading-none">قصير<span className="leading-none text-justify">${arabic80}</span></p>`);
  assert.equal(findings.length, 1);
});

test('does not treat markup-like JavaScript strings as JSX elements', () => {
  const findings = scanMarkup(`const example = '<p className="text-center leading-none">${arabic80}</p>';`);
  assert.equal(findings.length, 0);
});

test('does not inspect markup-like strings inside HTML script elements', () => {
  const findings = scanMarkup(`<script>const sample = '<p class="text-center leading-none">${arabic80}</p>';</script>`, 'index.html');
  assert.equal(findings.length, 0);
});
