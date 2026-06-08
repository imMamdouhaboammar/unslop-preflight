#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skillRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const files = [
  ['INTAKE.session.md', 'assets/intake-session.template.md'],
  ['STANDARDS.search-notes.md', 'assets/standards-search-notes.template.md'],
  ['PRODUCT.md', 'assets/PRODUCT.template.md'],
  ['DESIGN.md', 'assets/DESIGN.template.md'],
];

for (const [target, template] of files) {
  const targetPath = path.join(root, target);
  const templatePath = path.join(skillRoot, template);
  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(templatePath, targetPath);
    console.log(`created ${target}`);
  } else {
    console.log(`exists ${target}`);
  }
}

const expectedDirs = ['src', 'app', 'pages', 'components', 'styles', 'public'];
const found = expectedDirs.filter((dir) => fs.existsSync(path.join(root, dir)));
console.log(`project scan: ${found.length ? found.join(', ') : 'no common frontend dirs found'}`);
