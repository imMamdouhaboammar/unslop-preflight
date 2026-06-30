import { existsSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { scanUi } from '../../scripts/scan-ui-implementation.mjs';
import { scanA11y } from '../../scripts/scan-accessibility.mjs';
import { scanWithRules, walk } from './scannerUtils.js';
import { overlayRules } from '../scanners/overlayScanner.js';
import { typographyRules } from '../scanners/typographyScanner.js';
import { layeringRules } from '../scanners/layeringScanner.js';
import { responsiveRules } from '../scanners/responsiveScanner.js';
import { sourceSlopRules } from '../scanners/sourceSlopScanner.js';

function resolveTargetDir(cwd, dir) {
  return isAbsolute(dir) ? dir : join(cwd, dir);
}

function messageFor(error, cwd) {
  const raw = error?.message || String(error || 'Unknown scanner failure');
  return raw.replaceAll(cwd, '<project>').replace(/\r?\n/g, ' ').slice(0, 240);
}

function attachMetadata(findings, metadata) {
  Object.defineProperty(findings, 'metadata', { value: metadata, enumerable: false });
  return findings;
}

function addSkipped(scannerResults, scanner, targetDir, reason, startedAt) {
  scannerResults.push({
    scanner,
    targetDir,
    status: 'skipped',
    durationMs: Date.now() - startedAt,
    error: reason
  });
}

function addResult(scannerResults, scanner, targetDir, startedAt, extra = {}) {
  scannerResults.push({
    scanner,
    targetDir,
    status: extra.status || 'ok',
    durationMs: Date.now() - startedAt,
    ...(extra.error ? { error: extra.error } : {})
  });
}

function runScanner({ name, type, run }, targetDir, cwd, allFindings, scannerResults) {
  const startedAt = Date.now();

  if (!existsSync(targetDir)) {
    addSkipped(scannerResults, name, targetDir, 'target directory not found', startedAt);
    return;
  }

  try {
    const findings = run(targetDir) || [];
    allFindings.push(...findings.map((finding) => ({ ...finding, type })));
    addResult(scannerResults, name, targetDir, startedAt);
  } catch (error) {
    addResult(scannerResults, name, targetDir, startedAt, {
      status: 'failed',
      error: messageFor(error, cwd)
    });
  }
}

function uniqueFindingsFor(findings) {
  const uniqueFindings = [];
  const seen = new Set();

  for (const finding of findings) {
    const key = `${finding.rule}:${finding.file}:${finding.line}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFindings.push(finding);
    }
  }

  return uniqueFindings;
}

function collectFiles(targetDir, filesSeen, scannerResults, cwd) {
  const startedAt = Date.now();

  try {
    for (const file of walk(targetDir)) filesSeen.add(file);
  } catch (error) {
    addResult(scannerResults, 'file-walk', targetDir, startedAt, {
      status: 'failed',
      error: messageFor(error, cwd)
    });
  }
}

function buildScanStats({ cwd, dirsToScan, filesSeen, findings, scannerResults, startedAt }) {
  const failures = scannerResults.filter((result) => result.status === 'failed');
  const skipped = scannerResults.filter((result) => result.status === 'skipped');

  return {
    filesScanned: filesSeen.size,
    filesSkipped: skipped.length,
    findings: findings.length,
    scannerFailures: failures.length,
    durationMs: Date.now() - startedAt,
    scannersRun: [...new Set(scannerResults.filter((result) => result.status === 'ok').map((result) => result.scanner))],
    scannersSkipped: skipped.map((result) => `${result.scanner}:${relative(cwd, result.targetDir) || result.targetDir}`),
    dirsScanned: dirsToScan
  };
}

export function emptySourceScanMetadata(reason = 'source-scan-disabled') {
  return {
    scannerResults: [],
    scanStats: {
      filesScanned: 0,
      filesSkipped: 0,
      findings: 0,
      scannerFailures: 0,
      durationMs: 0,
      scannersRun: [],
      scannersSkipped: [reason]
    }
  };
}

export function runSourceScanners(cwd, fingerprint) {
  const startedAt = Date.now();
  const allFindings = [];
  const scannerResults = [];
  const filesSeen = new Set();
  const dirsToScan = fingerprint.srcDirs.length > 0 ? fingerprint.srcDirs : ['src', 'app', 'components'];
  const modularRules = [...overlayRules, ...typographyRules, ...layeringRules, ...responsiveRules, ...sourceSlopRules];
  const scanners = [
    { name: 'ui', type: 'ui', run: scanUi },
    { name: 'accessibility', type: 'a11y', run: scanA11y },
    { name: 'modular', type: 'modular', run: (targetDir) => scanWithRules(targetDir, modularRules) }
  ];

  for (const dir of dirsToScan) {
    const targetDir = resolveTargetDir(cwd, dir);

    if (existsSync(targetDir)) {
      collectFiles(targetDir, filesSeen, scannerResults, cwd);
    }

    for (const scanner of scanners) {
      runScanner(scanner, targetDir, cwd, allFindings, scannerResults);
    }
  }

  const uniqueFindings = uniqueFindingsFor(allFindings);
  const scanStats = buildScanStats({ cwd, dirsToScan, filesSeen, findings: uniqueFindings, scannerResults, startedAt });

  return attachMetadata(uniqueFindings, { scannerResults, scanStats });
}
