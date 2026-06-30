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

    // Helper to determine if a rule is requested
    const hasRule = (ruleId) => {
      if (!findings || findings.length === 0) return true; // If no findings are specified, run all fixers
      return findings.some(f => f.rule === ruleId);
    };

    // 1. Unsafe target blank (Rule: target-blank-without-rel)
    if (hasRule('target-blank-without-rel') && /target=["']_blank["']/i.test(currentContent)) {
      const before = currentContent;
      currentContent = currentContent.replace(/<a\s+([^>]*target=["']_blank["'][^>]*)>/g, (match, attrs) => {
        if (/rel=/i.test(attrs)) {
          return match; // Skip if already has rel
        }
        return `<a ${attrs} rel="noopener noreferrer">`;
      });
      if (before !== currentContent) {
        fixes.push({
          id: `fix_target_blank_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          findingId: 'target-blank-without-rel',
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

    // 2. Missing button type (Rule: missing-button-type)
    const isJsxFile = filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts');
    if (isJsxFile && hasRule('missing-button-type') && /<button\b/i.test(currentContent)) {
      const before = currentContent;
      currentContent = currentContent.replace(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi, (match, attrs, body) => {
        if (/type=/i.test(attrs)) {
          return match; // Skip if already has type
        }
        const lowerAttrs = attrs.toLowerCase();
        const lowerBody = body.toLowerCase();
        // Skip if attrs or button children indicate submit, save, delete, or forms
        if (lowerAttrs.includes('submit') || lowerAttrs.includes('save') || lowerAttrs.includes('delete') || lowerAttrs.includes('create') || lowerAttrs.includes('form') ||
            lowerBody.includes('submit') || lowerBody.includes('save') || lowerBody.includes('delete') || lowerBody.includes('create') || lowerBody.includes('form')) {
          return match; // Skip
        }
        // Skip if inside form or onSubmit is in the file (high precaution)
        if (currentContent.includes('onSubmit') || currentContent.includes('<form')) {
          // Let's skip if we aren't completely confident
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

    // 3. Image missing loading lazy (Rule: image-without-loading)
    if ((hasRule('image-without-loading') || hasRule('image-without-size-review')) && /<img\b/i.test(currentContent)) {
      // Safety exclusion: Skip Next.js Image component
      const hasNextImage = currentContent.includes('next/image') || currentContent.includes('<Image');
      if (!hasNextImage) {
        const before = currentContent;
        currentContent = currentContent.replace(/<img\b([^>]*?)(\s*\/)?>/gi, (match, attrs, selfClose) => {
          if (/loading=/i.test(attrs)) {
            return match; // Skip if already has loading
          }
          const lowerAttrs = attrs.toLowerCase();
          // Skip hero/above-the-fold/fetchpriority
          if (lowerAttrs.includes('priority') || lowerAttrs.includes('hero') || lowerAttrs.includes('above-the-fold') || lowerAttrs.includes('fetchpriority')) {
            return match; // Skip
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

    // 4. Missing alt on decorative-looking images
    if (hasRule('image-without-alt') && /<img\b/i.test(currentContent)) {
      const before = currentContent;
      currentContent = currentContent.replace(/<img\b([^>]*?)(\s*\/)?>/gi, (match, attrs, selfClose) => {
        if (/alt=/i.test(attrs)) {
          return match; // Skip if already has alt
        }
        const lowerAttrs = attrs.toLowerCase();
        // High confidence decorative markers
        const isDecorative = lowerAttrs.includes('icon') || lowerAttrs.includes('decor') || lowerAttrs.includes('pattern') || lowerAttrs.includes('bg-') || lowerAttrs.includes('divider') || lowerAttrs.includes('spacer') || lowerAttrs.includes('avatar') || lowerAttrs.includes('decorative');
        if (isDecorative) {
          return `<img${attrs} alt=""${selfClose || ''}>`;
        }
        return match; // Skip otherwise
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

    // 5. Tailwind transition-all (Rule: transition-all-animation-slop)
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
        return match; // Skip if complex
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

    // 6. Focus outline none (Rule: outline-none-without-focus-visible)
    if (hasRule('outline-none-without-focus-visible') && /outline-none/i.test(currentContent)) {
      const tailwindDetected = currentContent.includes('tailwindcss') || currentContent.includes('bg-') || currentContent.includes('text-') || currentContent.includes('p-') || currentContent.includes('m-');
      if (tailwindDetected) {
        const before = currentContent;
        currentContent = currentContent.replace(/(class(?:Name)?=["'])([^"']*\boutline-none\b[^"']*)(["'])/g, (match, prefix, classList, suffix) => {
          if (classList.includes('focus-visible:ring')) {
            return match; // Already has focus-visible ring
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

    // 7. console.log in source
    if (hasRule('console-log-in-source') && /console\.log\(/i.test(currentContent)) {
      const isTestFile = filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('tests/') || filePath.includes('scripts/') || filePath.includes('benchmarks/');
      if (!isTestFile) {
        const before = currentContent;
        currentContent = currentContent.split(/\r?\n/).map(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('console.log(') && (trimmed.endsWith(');') || trimmed.endsWith(')'))) {
            if (trimmed.includes('//') || trimmed.includes('/*') || trimmed.includes('debug') || trimmed.includes('process.env')) {
              return line; // Skip intentional/debug comments
            }
            return ''; // Remove standalone simple console.log
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

  /**
   * Helper to estimate changed lines count.
   */
  countDiffLines(before = '', after = '') {
    const beforeLines = before.split(/\r?\n/).length;
    const afterLines = after.split(/\r?\n/).length;
    return Math.abs(beforeLines - afterLines) || 1; // Default minimum 1 line changed
  }
}

/**
 * High-level runner that executes safe source code fixes.
 * 
 * @param {string} cwd Project root path.
 * @param {Array<object>} findings All scanner findings.
 * @param {object} flags Command line flags.
 * @returns {Promise<{ applied: Array<object>, skipped: Array<object>, failed: Array<object> }>} Fix results datasets.
 */
export function runSourceFixEngine(cwd, findings = [], flags = {}) {
  const engine = new SourceFixEngine(cwd, flags);
  const applied = [];
  const skipped = [];
  const failed = [];

  // Group findings by file
  const findingsByFile = {};
  for (const finding of findings) {
    if (!finding.file) continue;
    const resolvedPath = resolve(cwd, finding.file);
    findingsByFile[resolvedPath] = findingsByFile[resolvedPath] || [];
    findingsByFile[resolvedPath].push(finding);
  }

  // Pre-validate patch list
  const patchesToValidate = Object.entries(findingsByFile).map(([filePath]) => ({
    filePath,
    addedLines: 2, // estimation
    removedLines: 2
  }));

  const batchValidation = engine.validator.validatePatches(patchesToValidate);

  for (const [absolutePath, fileFindings] of Object.entries(findingsByFile)) {
    const relativePath = relative(cwd, absolutePath);
    
    // Check individual file safety
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

      // Check validation again for specific changes
      const patchObj = {
        filePath: absolutePath,
        addedLines: updatedContent.split(/\r?\n/).length,
        removedLines: originalContent.split(/\r?\n/).length
      };
      
      const patchSafety = engine.validator.validatePatches([patchObj]);
      const mode = flags.safeFix || flags['safe-fix'] || flags.repairMode === 'safe-fix';
      
      if (!patchSafety.valid) {
        for (const fix of fixes) {
          skipped.push({
            ...fix,
            status: 'skipped',
            reason: 'unsafe'
          });
        }
      } else if (mode && !flags.dryRun && !flags['dry-run']) {
        writeFileSync(absolutePath, updatedContent, 'utf8');
        for (const fix of fixes) {
          applied.push(fix);
        }
      } else {
        // Mode is plan-only, doc-fix or dry-run, so skip writing but record the planned fixes as skipped due to mode
        for (const fix of fixes) {
          skipped.push({
            ...fix,
            status: 'skipped',
            reason: flags.dryRun ? 'dry-run-preview' : 'mode-restriction'
          });
        }
      }
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

  return { applied, skipped, failed };
}
