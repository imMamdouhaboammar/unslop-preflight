import { resolve, extname, sep, basename } from 'node:path';

/**
 * SafetyValidator ensures code modifications are constrained within safe boundaries,
 * preventing modifications to critical system files, dependencies, environment configs,
 * lockfiles, and enforcing user-defined patch limits.
 */
export class SafetyValidator {
  /**
   * @param {string} projectRoot The absolute path to the project root directory.
   * @param {object} options Configuration options for validation and patch limits.
   * @param {number} [options.maxFixFiles=20] Max files allowed to be changed (flag --max-fix-files).
   * @param {number} [options.maxFixLines=300] Max total lines allowed to be changed (flag --max-fix-lines).
   * @param {number} [options.maxLinesPerFile=50] Max lines allowed to be changed per file.
   */
  constructor(projectRoot, options = {}) {
    if (!projectRoot) {
      throw new Error('Project root path is required for SafetyValidator');
    }
    this.projectRoot = resolve(projectRoot);
    
    // Parse limits with proper flag mapping and fallback values
    this.maxFixFiles = Number(options.maxFixFiles ?? options['max-fix-files'] ?? 20);
    this.maxLinesPerFile = Number(options.maxLinesPerFile ?? options['max-lines-per-file'] ?? 50);
    this.maxFixLines = Number(options.maxFixLines ?? options['max-fix-lines'] ?? 300);

    // Permitted file extensions for safe source fixes
    this.safeExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.md']);

    // Standard package/dependency lockfiles to protect from arbitrary modification
    this.lockfiles = new Set([
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lockb',
      'skills-lock.json',
      'composer.lock',
      'Gemfile.lock',
      'Cargo.lock',
      'poetry.lock',
      'mix.lock'
    ]);
  }

  /**
   * Validates if a single file path is safe to modify.
   * @param {string} filePath Absolute or relative path to the file.
   * @returns {{ valid: boolean, reason?: string }} Result of validation.
   */
  validateFile(filePath) {
    if (!filePath) {
      return { valid: false, reason: 'File path is required' };
    }

    // Resolve path to make it absolute
    const resolvedPath = resolve(this.projectRoot, filePath);

    // 1. Path traversal protection: Ensure file is strictly under the project root
    if (!resolvedPath.startsWith(this.projectRoot + sep) && resolvedPath !== this.projectRoot) {
      return {
        valid: false,
        reason: `File path '${filePath}' resolves outside the project root directory '${this.projectRoot}'`
      };
    }

    // Compute relative parts for sub-directory scanning
    const relativePath = resolvedPath.slice(this.projectRoot.length);
    const segments = relativePath.split(sep).filter(Boolean);

    // 2. Check for forbidden directories in path segments (node_modules, dist, build)
    for (const segment of segments) {
      const lower = segment.toLowerCase();
      if (lower === 'node_modules') {
        return {
          valid: false,
          reason: `File '${filePath}' lies inside a forbidden 'node_modules' directory`
        };
      }
      if (lower === 'dist' || lower === 'build') {
        return {
          valid: false,
          reason: `File '${filePath}' lies inside a forbidden build directory ('${segment}')`
        };
      }
    }

    const filename = basename(resolvedPath);
    const lowerFilename = filename.toLowerCase();

    // 3. Prevent modification of environment configuration files (.env)
    if (lowerFilename === '.env' || lowerFilename.startsWith('.env.')) {
      return {
        valid: false,
        reason: `File '${filePath}' is a restricted environment configuration file (.env)`
      };
    }

    // 4. Prevent modification of dependency/package manager lockfiles
    if (this.lockfiles.has(lowerFilename) || lowerFilename.endsWith('-lock.json') || lowerFilename.endsWith('.lock')) {
      return {
        valid: false,
        reason: `File '${filePath}' is a protected dependency lockfile`
      };
    }

    // 5. Ensure file extension is within the safe list (.js, .jsx, .ts, .tsx, .css, .md)
    const ext = extname(resolvedPath).toLowerCase();
    if (!this.safeExtensions.has(ext)) {
      return {
        valid: false,
        reason: `File '${filePath}' has an unsafe extension '${ext}'. Allowed: .js, .jsx, .ts, .tsx, .css, .md`
      };
    }

    return { valid: true };
  }

  /**
   * Validates a batch of proposed patches against path safety rules and patch limits.
   * @param {Array<{ filePath: string, addedLines: number, removedLines: number }>} patches Proposed patches.
   * @returns {{ valid: boolean, reasons: string[] }} Validation result with descriptive skip reasons.
   */
  validatePatches(patches) {
    if (!Array.isArray(patches)) {
      return {
        valid: false,
        reasons: ['Proposed patches must be specified as an array']
      };
    }

    const reasons = [];
    let totalLinesChanged = 0;
    const uniqueFiles = new Set();

    for (const patch of patches) {
      const { filePath, addedLines = 0, removedLines = 0 } = patch;
      
      if (!filePath) {
        reasons.push('Invalid patch entry: missing filePath');
        continue;
      }

      // Check single file path safety
      const fileCheck = this.validateFile(filePath);
      if (!fileCheck.valid) {
        reasons.push(`[File Blocked] ${fileCheck.reason}`);
        continue;
      }

      // Track unique files to enforce maxFiles limit
      const resolvedPath = resolve(this.projectRoot, filePath);
      uniqueFiles.add(resolvedPath);

      // Validate per-file changed lines limit
      const fileLinesChanged = Math.max(0, addedLines) + Math.max(0, removedLines);
      if (fileLinesChanged > this.maxLinesPerFile) {
        reasons.push(
          `[Limit Exceeded] File '${filePath}' proposes ${fileLinesChanged} line changes (added: ${addedLines}, removed: ${removedLines}), exceeding the limit of ${this.maxLinesPerFile} changed lines per file`
        );
      }

      totalLinesChanged += fileLinesChanged;
    }

    // Validate max files changed limit
    if (uniqueFiles.size > this.maxFixFiles) {
      reasons.push(
        `[Limit Exceeded] Total changed files count (${uniqueFiles.size}) exceeds the limit of ${this.maxFixFiles} files (--max-fix-files)`
      );
    }

    // Validate max total lines changed limit
    if (totalLinesChanged > this.maxFixLines) {
      reasons.push(
        `[Limit Exceeded] Total changed lines (${totalLinesChanged}) across all files exceeds the limit of ${this.maxFixLines} lines (--max-fix-lines)`
      );
    }

    return {
      valid: reasons.length === 0,
      reasons
    };
  }
}

/**
 * Shorthand helper to validate a single file path.
 * @param {string} filePath Absolute or relative path to file.
 * @param {string} projectRoot Project root directory path.
 * @param {object} [options] Configuration overrides.
 * @returns {boolean} True if safe.
 */
export function isSafeFile(filePath, projectRoot, options = {}) {
  const validator = new SafetyValidator(projectRoot, options);
  return validator.validateFile(filePath).valid;
}

/**
 * Shorthand helper to validate proposed patches.
 * @param {Array<{ filePath: string, addedLines: number, removedLines: number }>} patches Proposed patches.
 * @param {string} projectRoot Project root directory path.
 * @param {object} [options] Configuration overrides.
 * @returns {{ valid: boolean, reasons: string[] }} Result of validation.
 */
export function validateProposedPatches(patches, projectRoot, options = {}) {
  const validator = new SafetyValidator(projectRoot, options);
  return validator.validatePatches(patches);
}
