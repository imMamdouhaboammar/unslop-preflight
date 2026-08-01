import fs from 'node:fs';
import path from 'node:path';

export function initReviewRound({ url, reviewDir = '.agent-review' }) {
  if (!fs.existsSync(reviewDir)) {
    fs.mkdirSync(reviewDir, { recursive: true });
  }
  const roundId = `round-${Date.now()}`;
  const roundMeta = { roundId, url, startTime: new Date().toISOString(), status: 'active' };
  fs.writeFileSync(path.join(reviewDir, `${roundId}.json`), JSON.stringify(roundMeta, null, 2));
  return roundMeta;
}

export function getPendingComments(reviewDir = '.agent-review') {
  const commentsPath = path.join(reviewDir, 'comments.json');
  if (!fs.existsSync(commentsPath)) return [];
  try {
    const raw = fs.readFileSync(commentsPath, 'utf8');
    return JSON.parse(raw).filter(c => !c.resolved);
  } catch {
    return [];
  }
}
