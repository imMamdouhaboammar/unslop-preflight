import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..', '..');
const PACKS_DIR = join(PROJECT_ROOT, 'references', 'standards-packs');

/**
 * Lists all available standards packs by reading the subdirectories under references/standards-packs/
 * @returns {Array<Object>} List of standards pack manifest objects
 */
export function listStandardsPacks() {
  if (!existsSync(PACKS_DIR)) return [];
  const packs = [];
  try {
    for (const entry of readdirSync(PACKS_DIR, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const manifestPath = join(PACKS_DIR, entry.name, 'manifest.json');
        if (existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
            if (manifest && manifest.id && manifest.name) {
              packs.push(manifest);
            }
          } catch (e) {
            // Silently ignore corrupted pack manifests to prevent CLI crash
          }
        }
      }
    }
  } catch (e) {
    // Return empty list if reading references/standards-packs fails
  }
  return packs;
}

/**
 * Loads a specific standards pack by ID, including its manifest and all extracted category rules
 * @param {string} packId The unique ID of the standards pack
 * @returns {Object} An object with { manifest, rules }
 */
export function loadStandardsPack(packId) {
  if (!packId || typeof packId !== 'string') {
    throw new Error('Invalid standards pack ID provided.');
  }

  const packDir = join(PACKS_DIR, packId);
  const manifestPath = join(packDir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error(`Standards pack "${packId}" not found.`);
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    throw new Error(`Failed to parse manifest for standards pack "${packId}": ${e.message}`);
  }

  if (!manifest || !manifest.id || !manifest.name) {
    throw new Error(`Standards pack "${packId}" manifest is missing required properties (id, name).`);
  }

  const rules = {};
  const extractedDir = join(packDir, 'extracted');
  
  if (manifest.categories && Array.isArray(manifest.categories)) {
    for (const category of manifest.categories) {
      const categoryFile = join(extractedDir, `${category}.json`);
      if (existsSync(categoryFile)) {
        try {
          rules[category] = JSON.parse(readFileSync(categoryFile, 'utf8'));
        } catch (e) {
          throw new Error(`Failed to parse category "${category}" rules for pack "${packId}": ${e.message}`);
        }
      } else {
        // Fallback or warning if a category declared in manifest is missing its file
        rules[category] = { rules: [] };
      }
    }
  }

  return { manifest, rules };
}
