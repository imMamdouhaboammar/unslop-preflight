import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { SafetyValidator } from './safetyValidator.js';

/**
 * SourceFixEngine resolves safe, local, deterministic source code fixes forAI-generated frontend slop.
 */
export class SourceFixEngine {
  constructor(projectRoot, options = {}) {
    this.projectRoot = resolve(projectRoot);
    this.validator = new SafetyValidator(projectRoot, options);
    this.flags = options;
  }

  /**
   * Applies all safe source fixes to a given file content based on findings.
   * @param {string} filePath Relative or absolute path of the file.
   * @param {string} content The original content of the file.
   * @param {Array<object>} findings Findings corresponding to this file.
   * @returns {{ content: string, fixes: Array<object> }} The updated content and individual fix details.
   */
  applyFixes(filePath, content, findings = []) {
    let currentContent = content;
    const fixes = [];

    // A source mutation must be authorized by an explicit matching finding.
    const hasRule = (ruleId) => Array.isArray(findings) && findings.some(f => f.rule === ruleId);

    // 1. Missing button type (Rule: missing-button-type)
    const isJsxFile = filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts');
    if (isJsxFile && hasRule('missing-button-type') && /<button\b/i.test(currentContent)) {
      const before = currentContent;
      const isInsideForm = (offset) => {
        const precedingFormTags = currentContent.slice(0, offset).match(/<\/?form\b[^>]*>/gi) || [];
        let depth = 0;
        for (const tag of precedingFormTags) {
          if (/^<\/form\b/i.test(tag)) {
            depth = Math.max(0, depth - 1);
          } else if (!/\/\s*>$/.test(tag)) {
            depth += 1;
          }
        }
        return depth > 0;
      };
      currentContent = currentContent.replace(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi, (match, attrs, body, offset) => {
        if (/type=/i.test(attrs)) {
          return match;
        }
        const lowerAttrs = attrs.toLowerCase();
        const lowerBody = body.toLowerCase();
        if (lowerAttrs.includes('submit') || lowerAttrs.includes('save') || lowerAttrs.includes('delete') || lowerAttrs.includes('create') || lowerAttrs.includes('form') ||
            lowerBody.includes('submit') || lowerBody.includes('save') || lowerBody.includes('delete') || lowerBody.includes('create') || lowerBody.includes('form')) {
          return match;
        }
        if (isInsideForm(offset)) {
          return match;
        }
        return `<button${attrs} type="button">${body}</button>`;
      });
      if (before !== currentContent) {
        fixes.push({
          id: `fix_button_type_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          findingId: 'missing-button-type',
          file: filePath,
          status: 'applied',
          reason: 'safe-fix-applied',
          beforeSnippet: before,
          afterSnippet: currentContent,
          changedLines: this.countDiffLines(before, currentContent),
          risk: 'low'
        });
      }
    }

    // 2. Image missing loading lazy (Rule: image-without-loading)
    if (hasRule('image-without-loading') && /<img\b/i.test(currentContent)) {
      const hasNextImage = currentContent.includes('next/image') || currentContent.includes('<Image');
      if (!hasNextImage) {
        const before = currentContent;
        currentContent = currentContent.replace(/<img\b([^>]*?)(\s*\/)?>/gi, (match, attrs, selfClose) => {
          if (/loading=/i.test(attrs)) {
            return match;
          }
          const lowerAttrs = attrs.toLowerCase();
          if (lowerAttrs.includes('priority') || lowerAttrs.includes('hero') || lowerAttrs.includes('above-the-fold') || lowerAttrs.includes('fetchpriority')) {
            return match;
          }
          return `<img${attrs} loading="lazy"${selfClose || ''}>`;
        });
        if (before !== currentContent) {
          fixes.push({
            id: `fix_img_lazy_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            findingId: 'image-without-loading',
            file: filePath,
            status: 'applied',
            reason: 'safe-fix-applied',
            beforeSnippet: before,
            afterSnippet: currentContent,
            changedLines: this.countDiffLines(before, currentContent),
            risk: 'low'
          });
        }
      }
    }

    // 3. Missing alt on decorative-looking images
    if (hasRule('image-without-alt') && /<img\b/i.test(currentContent)) {
      const before = currentContent;
      currentContent = currentContent.replace(/<img\b([^>]*?)(\s*\/)?>/gi, (match, attrs, selfClose) => {
        if (/alt=/i.test(attrs)) {
          return match;
        }
        const lowerAttrs = attrs.toLowerCase();
        const isDecorative = lowerAttrs.includes('pattern') || lowerAttrs.includes('bg-') || lowerAttrs.includes('divider') || lowerAttrs.includes('spacer') || lowerAttrs.includes('decorative');
        if (isDecorative) {
          return `<img${attrs} alt=""${selfClose || ''}>`;
        }
        return match;
      });
      if (before !== currentContent) {
        fixes.push({
          id: `fix_img_alt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          findingId: 'image-without-alt',
          file: filePath,
          status: 'applied',
          reason: 'safe-fix-applied',
          beforeSnippet: before,
          afterSnippet: currentContent,
          changedLines: this.countDiffLines(before, currentContent),
          risk: 'low'
        });
      }
    }

    // 4. Tailwind transition-all (Rule: transition-all-animation-slop)
    if (hasRule('transition-all-animation-slop') && /transition-all/i.test(currentContent)) {
      const before = currentContent;
      currentContent = currentContent.replace(/(class(?:Name)?=["'])([^"']*\btransition-all\b[^"']*)(["'])/g, (match, prefix, classList, suffix) => {
        const lowerList = classList.toLowerCase();
        const hasColors = /\b(text|bg|border|ring|divide|from|via|to|decoration|outline)-\w+/.test(lowerList);
        const hasTransform = /\b(scale|translate|rotate|skew|transform)\b/.test(lowerList);

        if (hasColors && !hasTransform) {
          const updatedList = classList.replace(/\btransition-all\b/, 'transition-colors');
          return `${prefix}${updatedList}${suffix}`;
        } else if (hasTransform && !hasColors) {
          const updatedList = classList.replace(/\btransition-all\b/, 'transition-transform');
          return `${prefix}${updatedList}${suffix}`;
        }
        return match;
      });
      if (before !== currentContent) {
        fixes.push({
          id: `fix_transition_all_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          findingId: 'transition-all-animation-slop',
          file: filePath,
          status: 'applied',
          reason: 'safe-fix-applied',
          beforeSnippet: before,
          afterSnippet: currentContent,
          changedLines: this.countDiffLines(before, currentContent),
          risk: 'low'
        });
      }
    }

    // 5. Focus outline none (Rule: outline-none-without-focus-visible)
    if (hasRule('outline-none-without-focus-visible') && /outline-none/i.test(currentContent)) {
      const tailwindDetected = currentContent.includes('tailwindcss') || currentContent.includes('bg-') || currentContent.includes('text-') || currentContent.includes('p-') || currentContent.includes('m-');
      if (tailwindDetected) {
        const before = currentContent;
        currentContent = currentContent.replace(/(class(?:Name)?=["'])([^"']*\boutline-none\b[^"']*)(["'])/g, (match, prefix, classList, suffix) => {
          if (classList.includes('focus-visible:ring')) {
            return match;
          }
          const updatedList = classList.replace(/\boutline-none\b/, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2');
          return `${prefix}${updatedList}${suffix}`;
        });
        if (before !== currentContent) {
          fixes.push({
            id: `fix_outline_none_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            findingId: 'outline-none-without-focus-visible',
            file: filePath,
            status: 'applied',
            reason: 'safe-fix-applied',
            beforeSnippet: before,
            afterSnippet: currentContent,
            changedLines: this.countDiffLines(before, currentContent),
            risk: 'low'
          });
        }
      }
    }

    // 6. console.log in source
    if (hasRule('console-log-in-source') && /console\.log\(/i.test(currentContent)) {
      const isTestFile = filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('tests/') || filePath.includes('scripts/') || filePath.includes('benchmarks/');
      if (!isTestFile) {
        const before = currentContent;
        currentContent = currentContent.split(/\r?\n/).map(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('console.log(') && (trimmed.endsWith(');') || trimmed.endsWith(')'))) {
            if (trimmed.includes('//') || trimmed.includes('/*') || trimmed.includes('debug') || trimmed.includes('process.env')) {
              return line;
            }
            return '';
          }
          return line;
        }).join('\n');
        if (before !== currentContent) {
          fixes.push({
            id: `fix_console_log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            findingId: 'console-log-in-source',
            file: filePath,
            status: 'applied',
            reason: 'safe-fix-applied',
            beforeSnippet: before,
            afterSnippet: currentContent,
            changedLines: this.countDiffLines(before, currentContent),
            risk: 'low'
          });
        }
      }
    }

    return { content: currentContent, fixes };
  }

  countChangedLineRange(before = '', after = '') {
    const beforeLines = before.split(/\r?\n/);
    const afterLines = after.split(/\r?\n/);
    let start = 0;

    while (start < beforeLines.length && start < afterLines.length && beforeLines[start] === afterLines[start]) {
      start += 1;
    }

    let beforeEnd = beforeLines.length - 1;
    let afterEnd = afterLines.length - 1;
    while (beforeEnd >= start && afterEnd >= start && beforeLines[beforeEnd] === afterLines[afterEnd]) {
      beforeEnd -= 1;
      afterEnd -= 1;
    }

    return {
      addedLines: Math.max(0, afterEnd - start + 1),
      removedLines: Math.max(0, beforeEnd - start + 1)
    };
  }

  countDiffLines(before = '', after = '') {
    const { addedLines, removedLines } = this.countChangedLineRange(before, after);
    return Math.max(1, addedLines + removedLines);
  }
}

/**
 * High-level runner that executes safe source code fixes.
 *
 * All candidate source mutations are planned first, then the real aggregate patch is
 * validated before any file is written. This keeps batch limits fail-closed and avoids
 * partially applying a repair set that exceeds the configured safety budget.
 *
 * @param {string} cwd Project root path.
 * @param {Array<object>} findings All scanner findings.
 * @param {object} flags Command line flags.
 * @returns {{ applied: Array<object>, skipped: Array<object>, failed: Array<object> }} Fix results datasets.
 */
export function runSourceFixEngine(cwd, findings = [], flags = {}) {
  const engine = new SourceFixEngine(cwd, flags);
  const applied = [];
  const skipped = [];
  const failed = [];
  const planned = [];

  const findingsByFile = {};
  for (const finding of findings) {
    if (!finding.file) continue;
    const resolvedPath = resolve(cwd, finding.file);
    findingsByFile[resolvedPath] = findingsByFile[resolvedPath] || [];
    findingsByFile[resolvedPath].push(finding);
  }

  for (const [absolutePath, fileFindings] of Object.entries(findingsByFile)) {
    const relativePath = relative(cwd, absolutePath);
    const fileSafety = engine.validator.validateFile(absolutePath);

    if (!fileSafety.valid) {
      for (const finding of fileFindings) {
        skipped.push({
          id: `skip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          findingId: finding.rule,
          file: relativePath,
          status: 'skipped',
          reason: 'unsafe',
          beforeSnippet: finding.excerpt || '',
          afterSnippet: '',
          changedLines: 0,
          risk: 'high',
          fixStrategy: finding.suggestedFix || 'Handle manually'
        });
      }
      continue;
    }

    try {
      const originalContent = readFileSync(absolutePath, 'utf8');
      const { content: updatedContent, fixes } = engine.applyFixes(relativePath, originalContent, fileFindings);

      if (fixes.length === 0) {
        for (const finding of fileFindings) {
          skipped.push({
            id: `skip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            findingId: finding.rule,
            file: relativePath,
            status: 'skipped',
            reason: 'no-fixer',
            beforeSnippet: finding.excerpt || '',
            afterSnippet: '',
            changedLines: 0,
            risk: 'low',
            fixStrategy: finding.suggestedFix || 'Handle manually'
          });
        }
        continue;
      }

      const patch = {
        filePath: absolutePath,
        ...engine.countChangedLineRange(originalContent, updatedContent)
      };
      const patchSafety = engine.validator.validatePatches([patch]);

      if (!patchSafety.valid) {
        for (const fix of fixes) {
          skipped.push({ ...fix, status: 'skipped', reason: 'unsafe' });
        }
        continue;
      }

      planned.push({ absolutePath, originalContent, updatedContent, fixes, patch });
    } catch (err) {
      for (const finding of fileFindings) {
        failed.push({
          id: `fail_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          findingId: finding.rule,
          file: relativePath,
          status: 'failed',
          reason: 'parse-failed',
          beforeSnippet: finding.excerpt || '',
          afterSnippet: '',
          changedLines: 0,
          risk: 'medium'
        });
      }
    }
  }

  const batchSafety = engine.validator.validatePatches(planned.map(({ patch }) => patch));
  if (!batchSafety.valid) {
    for (const { fixes } of planned) {
      for (const fix of fixes) {
        skipped.push({ ...fix, status: 'skipped', reason: 'unsafe' });
      }
    }
    return { applied, skipped, failed };
  }

  const mode = flags.safeFix || flags['safe-fix'] || flags.repairMode === 'safe-fix';
  const dryRun = flags.dryRun || flags['dry-run'];

  if (mode && !dryRun) {
    const written = [];
    try {
      for (const entry of planned) {
        writeFileSync(entry.absolutePath, entry.updatedContent, 'utf8');
        written.push(entry);
      }
      for (const { fixes } of planned) {
        applied.push(...fixes);
      }
    } catch (err) {
      for (let index = written.length - 1; index >= 0; index -= 1) {
        const entry = written[index];
        try {
          writeFileSync(entry.absolutePath, entry.originalContent, 'utf8');
        } catch (rollbackError) {
          failed.push({
            id: `fail_rollback_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            findingId: entry.fixes[0]?.findingId || 'repair-rollback',
            file: relative(cwd, entry.absolutePath),
            status: 'failed',
            reason: 'rollback-failed',
            beforeSnippet: entry.updatedContent,
            afterSnippet: entry.originalContent,
            changedLines: 0,
            risk: 'high'
          });
        }
      }
      for (const { fixes } of planned) {
        for (const fix of fixes) {
          failed.push({
            ...fix,
            status: 'failed',
            reason: 'write-failed',
            risk: 'high'
          });
        }
      }
    }
  } else {
    for (const { fixes } of planned) {
      for (const fix of fixes) {
        skipped.push({
          ...fix,
          status: 'skipped',
          reason: dryRun ? 'dry-run-preview' : 'mode-restriction'
        });
      }
    }
  }

  return { applied, skipped, failed };
}
