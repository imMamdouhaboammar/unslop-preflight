export function planRepairs(evidences) {
  const plan = {
    safeDocs: [],
    safeConfig: [],
    suggestedPatches: [],
    blocked: []
  };

  for (const e of evidences) {
    if (e.effort === 'large' || e.impact === 'architectural') {
      plan.blocked.push(e);
      continue;
    }

    if (e.type === 'spec') {
      plan.safeDocs.push(e);
    } else if (e.type === 'config') {
      plan.safeConfig.push(e);
    } else {
      plan.suggestedPatches.push(e);
    }
  }

  return plan;
}
