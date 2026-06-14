import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function fingerprintProject(cwd) {
  const fingerprint = {
    framework: 'unknown',
    uiLibraries: [],
    configs: [],
    routing: 'unknown',
    hasTypescript: false,
    hasTailwind: false,
    packageJson: null,
    srcDirs: []
  };

  try {
    const pkgPath = join(cwd, 'package.json');
    if (existsSync(pkgPath)) {
      fingerprint.packageJson = JSON.parse(readFileSync(pkgPath, 'utf8'));
      const deps = { 
        ...fingerprint.packageJson.dependencies, 
        ...fingerprint.packageJson.devDependencies 
      };

      if (deps['next']) fingerprint.framework = 'next';
      else if (deps['react']) fingerprint.framework = 'react';
      else if (deps['vue']) fingerprint.framework = 'vue';
      else if (deps['svelte']) fingerprint.framework = 'svelte';
      else if (deps['@astrojs/core']) fingerprint.framework = 'astro';
      else if (deps['nuxt']) fingerprint.framework = 'nuxt';

      if (deps['typescript']) fingerprint.hasTypescript = true;
      if (deps['tailwindcss']) fingerprint.hasTailwind = true;

      const uiLibs = ['@mui/material', '@chakra-ui/react', 'antd', 'lucide-react', 'framer-motion', 'radix-ui', 'shadcn'];
      fingerprint.uiLibraries = uiLibs.filter(lib => Object.keys(deps).some(dep => dep.includes(lib)));
    }
  } catch (e) {
    // Ignore missing package.json
  }

  // Detect routing / structure
  if (existsSync(join(cwd, 'app'))) {
    fingerprint.routing = 'app-router';
    fingerprint.srcDirs.push('app');
  } else if (existsSync(join(cwd, 'src', 'app'))) {
    fingerprint.routing = 'src/app-router';
    fingerprint.srcDirs.push('src/app');
  } else if (existsSync(join(cwd, 'pages'))) {
    fingerprint.routing = 'pages-router';
    fingerprint.srcDirs.push('pages');
  } else if (existsSync(join(cwd, 'src', 'pages'))) {
    fingerprint.routing = 'src/pages-router';
    fingerprint.srcDirs.push('src/pages');
  }

  if (existsSync(join(cwd, 'src'))) {
    fingerprint.srcDirs.push('src');
  }
  if (existsSync(join(cwd, 'components'))) {
    fingerprint.srcDirs.push('components');
  } else if (existsSync(join(cwd, 'src', 'components'))) {
    fingerprint.srcDirs.push('src/components');
  }

  // Deduplicate
  fingerprint.srcDirs = [...new Set(fingerprint.srcDirs)];

  // Configs
  ['tailwind.config.js', 'tailwind.config.ts', 'tsconfig.json', 'vite.config.js', 'next.config.js'].forEach(cfg => {
    if (existsSync(join(cwd, cfg))) fingerprint.configs.push(cfg);
  });

  return fingerprint;
}
