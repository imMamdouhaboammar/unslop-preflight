import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const EXPECTED_SCORING_HASH = '835b9848d901a385cc1126e2d5b1a8c458850c630ec19f58e7583e2f49da1deb';

export function verifyScoringIntegrity() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const scoringPath = join(__dirname, 'scoring.js');
    const content = readFileSync(scoringPath, 'utf8');
    const normalized = content.replace(/\r\n/g, '\n').trim();
    const actualHash = createHash('sha256').update(normalized).digest('hex');

    if (actualHash !== EXPECTED_SCORING_HASH) {
      const msg = `Codebase evaluation gamed! Anti-tamper triggered: scoring.js has been modified.\nExpected hash: ${EXPECTED_SCORING_HASH}\nActual hash: ${actualHash}`;
      console.error(`\x1b[31m\x1b[1m[TAMPER ALERT]\x1b[0m ${msg}`);
      throw new Error(msg);
    }
  } catch (error) {
    if (error.message.includes('Anti-tamper triggered')) {
      throw error;
    }
    // If the file is completely missing or unreadable, throw a clear block
    throw new Error(`Integrity check failed: scoring.js cannot be verified. Error: ${error.message}`);
  }
}
