#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2] || 'INTAKE.session.md';
const template = path.join('assets', 'intake-session.template.md');
if (fs.existsSync(out)) {
  console.log(`${out} already exists`);
  process.exit(0);
}
if (!fs.existsSync(template)) {
  console.error(`missing ${template}`);
  process.exit(1);
}
fs.copyFileSync(template, out);
console.log(`created ${out}`);
console.log('Complete the intake before PRODUCT.md, DESIGN.md, amplify, audit, or implementation work.');
console.log('First mandatory question: Which design system baseline should guide this project? Atlassian, Salesforce Lightning, Shopify Polaris, Material Design, Apple Human Interface Guidelines, or Custom / hybrid.');
