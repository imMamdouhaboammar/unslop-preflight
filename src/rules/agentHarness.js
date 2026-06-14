import { rule } from './utils.js';

const harnessTerms = /install agent harness|agent harness|harness inventory|tool harness|skills harness|tooling harness/i;
const bulkGuardTerms = /install only|only install|actually need|context overhead|bulk install|do not bulk|avoid bulk|unnecessary context/i;
const priorityTerms = /required|urgent|recommended|optional|priority|why now|use when|skip when/i;
const trustTerms = /verify|version|dry run|audit|checksum|review source|trusted source|restart|security note|permission|rollback/i;
const reactTerms = /\breact\b|next\.js|vite|jsx|tsx|component|frontend|ui implementation/i;
const reactHarnessTerms = /react error boundary|react doctor|runtime boundary|react health/i;
const reviewTerms = /large codebase|refactor|migration|review|architecture|dependency graph|repository graph|build graph/i;
const reviewHarnessTerms = /review graph|duplicate detector|duplication scan|repository graph/i;

function text(ctx) {
  return `${ctx.files['PRODUCT.md'] || ''}\n${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`;
}

export const agentHarnessRules = [
  rule(
    'install-agent-harness-missing',
    'Agent handoff should include an Install Agent Harness inventory',
    'agent-harness-readiness',
    'error',
    'AGENTS.md',
    (ctx) => !harnessTerms.test(text(ctx)),
    'Add an Install Agent Harness section. Ask the agent to inspect the project and recommend only the missing tools or skills needed now, with priority and reason.',
    'suggested'
  ),
  rule(
    'agent-harness-bulk-install-guard-missing',
    'Harness guidance must warn against bulk-installing every skill',
    'agent-harness-readiness',
    'error',
    'AGENTS.md',
    (ctx) => harnessTerms.test(text(ctx)) && !bulkGuardTerms.test(text(ctx)),
    'Add a note: install only the skills and tools this project actually needs. Bulk installs add unnecessary context overhead.',
    'suggested'
  ),
  rule(
    'agent-harness-priority-matrix-missing',
    'Harness recommendations need priority and project-specific reason',
    'agent-harness-readiness',
    'error',
    'AGENTS.md',
    (ctx) => harnessTerms.test(text(ctx)) && !priorityTerms.test(text(ctx)),
    'For each recommended harness item, include priority, reason, when to use it, and when to skip it.',
    'suggested'
  ),
  rule(
    'agent-harness-trust-note-missing',
    'Harness installs need verification and trust notes',
    'agent-harness-readiness',
    'error',
    'AGENTS.md',
    (ctx) => harnessTerms.test(text(ctx)) && !trustTerms.test(text(ctx)),
    'Add verification steps: version check, dry run, source review, restart requirement, and rollback note where applicable.',
    'suggested'
  ),
  rule(
    'react-harness-recommendation-missing',
    'React projects should consider runtime safety harness tools',
    'agent-harness-readiness',
    'error',
    'AGENTS.md',
    (ctx) => reactTerms.test(text(ctx)) && !reactHarnessTerms.test(text(ctx)),
    'For React or Next UI work, consider runtime error boundary and React health-check harnesses when runtime failures are likely.',
    'suggested'
  ),
  rule(
    'code-review-harness-recommendation-missing',
    'Large or risky code work should consider review and duplication harnesses',
    'agent-harness-readiness',
    'error',
    'AGENTS.md',
    (ctx) => reviewTerms.test(text(ctx)) && !reviewHarnessTerms.test(text(ctx)),
    'For migrations, refactors, or large codebases, consider repository graph review and duplicate-code detection harnesses.',
    'suggested'
  )
];
