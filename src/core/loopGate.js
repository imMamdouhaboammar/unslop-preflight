export function checkLoopGate(changeType, filepath, gateConfig = {}) {
  const denylist = gateConfig.denylist || [];
  if (denylist.some(d => filepath.includes(d))) {
    return { ok: false, reason: `File ${filepath} is on the loop gate denylist.` };
  }
  return { ok: true };
}
