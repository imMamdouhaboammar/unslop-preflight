#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from '../src/cli.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));
run(process.argv.slice(2), { version: pkg.version }).catch((error) => {
  const debug = process.argv.includes('--debug') || process.argv.includes('--verbose');
  console.error(debug ? error.stack : `Error: ${error.message}`);
  process.exit(1);
});
