export function calculateScore(evidences) {
  let score = 100;
  
  const blockers = evidences.filter(e => e.severity === 'error' || e.severity === 'blocker');
  const warnings = evidences.filter(e => e.severity === 'warning');
  const infos = evidences.filter(e => e.severity === 'info');

  // New confidence/impact weighted scoring
  for (const e of blockers) {
    let penalty = 18;
    if (e.confidence === 'high') penalty += 5;
    if (e.impact === 'visual break' || e.impact === 'accessibility break') penalty += 5;
    score -= penalty;
  }

  for (const e of warnings) {
    let penalty = 7;
    if (e.confidence === 'high') penalty += 2;
    score -= penalty;
  }

  score -= infos.length * 2;

  return Math.max(0, score);
}

export function readinessBand(score, blockersCount, warningsCount) {
  if (blockersCount > 0) return 'blocked';
  if (score < 70 || warningsCount >= 8) return 'needs-spec-work';
  if (warningsCount > 0) return 'agent-ready-with-fix-list';
  return 'agent-ready';
}

export function readinessMessage(band) {
  if (band === 'blocked') return 'Do not hand this to an AI coding agent yet. Resolve errors and blocked source issues first.';
  if (band === 'needs-spec-work') return 'Spec and codebase quality is too thin for reliable AI implementation. Tighten the fix list before coding.';
  if (band === 'agent-ready-with-fix-list') return 'Usable for an AI coding agent, but include the fix list and source repairs in the handoff prompt.';
  return 'Ready for AI-assisted implementation with standard verification.';
}
