#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const casesPath = process.argv[2] || path.join('evals', 'eval-cases.json');
if (!fs.existsSync(casesPath)) {
  console.error(`missing ${casesPath}`);
  process.exit(1);
}

const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
console.log(`loaded ${cases.length} eval cases`);

for (const [index, item] of cases.entries()) {
  console.log(`\n# ${item.id || index + 1}: ${item.name}`);
  console.log(`prompt: ${item.prompt}`);
  if (item.expected_mode) console.log(`expected mode: ${item.expected_mode}`);
  console.log('must include:');
  for (const rule of item.must_include || []) console.log(`- ${rule}`);
  if (item.must_avoid?.length) {
    console.log('must avoid:');
    for (const rule of item.must_avoid) console.log(`- ${rule}`);
  }
}

console.log('\nUse these cases manually with the skill, then compare outputs against must_include and must_avoid.');
