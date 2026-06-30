import { join } from 'node:path';
import { scanUi } from '../../scripts/scan-ui-implementation.mjs';
import { scanA11y } from '../../scripts/scan-accessibility.mjs';
import { scanWithRules } from './scannerUtils.js';
import { overlayRules } from '../scanners/overlayScanner.js';
import { typographyRules } from '../scanners/typographyScanner.js';
import { layeringRules } from '../scanners/layeringScanner.js';
import { responsiveRules } from '../scanners/responsiveScanner.js';
import { sourceSlopRules } from '../scanners/sourceSlopScanner.js';

export function runSourceScanners(cwd, fingerprint) {
  const allFindings = [];

  const dirsToScan = fingerprint.srcDirs.length > 0 ? fingerprint.srcDirs : ['src', 'app', 'components'];

  for (const dir of dirsToScan) {
    const targetDir = join(cwd, dir);
    
    try {
      const uiFindings = scanUi(targetDir);
      allFindings.push(...uiFindings.map(f => ({ ...f, type: 'ui' })));
    } catch (e) {}

    try {
      const a11yFindings = scanA11y(targetDir);
      allFindings.push(...a11yFindings.map(f => ({ ...f, type: 'a11y' })));
    } catch (e) {}

    try {
      const modularRules = [...overlayRules, ...typographyRules, ...layeringRules, ...responsiveRules, ...sourceSlopRules];
      const modularFindings = scanWithRules(targetDir, modularRules);
      allFindings.push(...modularFindings.map(f => ({ ...f, type: 'modular' })));
    } catch (e) {}
  }

  const uniqueFindings = [];
  const seen = new Set();
  
  for (const f of allFindings) {
    const key = `${f.rule}:${f.file}:${f.line}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFindings.push(f);
    }
  }

  return uniqueFindings;
}
