import { rule, has, section } from './utils.js';

const agentDoc = (ctx) => ctx.agentInstructions || ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || '';
const agentFile = (ctx) => ctx.agentInstructionFile || 'AGENTS.md';

export const agentRules = [
  rule('missing-do-not-break', 'Missing do-not-break regression rules', 'regression-protection', 'error', 'AGENTS.md', (ctx) => {
    const doc = agentDoc(ctx);
    return Boolean(doc) && !has(doc, /(do not break|regression|preserve existing)/i);
  }, (ctx) => `Add regression guard and do-not-break rules to ${agentFile(ctx)}.`, 'auto'),

  rule('missing-verification-checklist', 'Agent instructions need a verification checklist', 'agent-handoff-readiness', 'error', 'AGENTS.md', (ctx) => {
    const doc = agentDoc(ctx);
    return Boolean(doc) && !has(doc, section(['Verification Checklist', 'QA Checklist']));
  }, (ctx) => `Add a verification checklist to ${agentFile(ctx)}.`, 'auto'),

  rule('missing-agent-handoff', 'DESIGN.md missing agent handoff instructions', 'agent-handoff-readiness', 'info', 'DESIGN.md', (ctx) => {
    return ctx.files['DESIGN.md'] && !has(ctx.files['DESIGN.md'], /agent|handoff/i);
  }, 'Add agent handoff instructions.', 'auto')
];
