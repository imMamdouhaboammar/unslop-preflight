#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = process.cwd();

const outArg = process.argv[2] || 'INTAKE.session.md';
const out = path.isAbsolute(outArg) ? outArg : path.join(PROJECT_ROOT, outArg);
const template = path.join(SKILL_ROOT, 'assets', 'intake-session.template.md');

if (fs.existsSync(out)) {
  console.log(`${path.relative(PROJECT_ROOT, out) || out} already exists`);
  process.exit(0);
}

if (!fs.existsSync(template)) {
  console.error(`missing template: ${template}`);
  process.exit(1);
}

fs.copyFileSync(template, out);
console.log(`created ${path.relative(PROJECT_ROOT, out) || out}`);
console.log('Complete the intake before PRODUCT.md, DESIGN.md, amplify, audit, or implementation work.');
console.log('First mandatory question: Which design system baseline should guide this project? Atlassian, Salesforce Lightning, Shopify Polaris, Material Design, Apple Human Interface Guidelines, or Custom / hybrid.');
