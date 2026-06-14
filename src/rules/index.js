import { rule } from './utils.js';
import { productRules } from './product.js';
import { designRules } from './design.js';
import { placeholderRules } from './placeholders.js';
import { rootCauseRules } from './rootCause.js';
import { agentHarnessRules } from './agentHarness.js';
import { responsiveRules } from './responsive.js';
import { modalViewportRules } from './modalViewport.js';
import { stackingRules } from './stacking.js';
import { uxRules } from './ux.js';
import { accessibilityRules } from './accessibility.js';
import { securityRules } from './security.js';
import { agentRules } from './agent.js';
import { tasteRules } from './taste.js';
import { typographyRules } from './typography.js';

const docs = ['PRODUCT.md', 'DESIGN.md'];

const readinessRules = [
  ...docs.map((file) => rule(
    `${file.toLowerCase().replace('.md','')}-missing`,
    `${file} is missing`,
    'implementation-readiness',
    'error',
    file,
    (ctx) => !ctx.files[file],
    `Create ${file}.`,
    'auto'
  )),
  rule(
    'agent-instructions-missing',
    'Agent instruction file is missing',
    'implementation-readiness',
    'error',
    'AGENTS.md',
    (ctx) => !ctx.files['AGENTS.md'] && !ctx.files['AGENT.md'],
    'Create AGENTS.md. Legacy AGENT.md is still accepted when already present.',
    'auto'
  )
];

export const rules = [
  ...readinessRules,
  ...productRules,
  ...designRules,
  ...placeholderRules,
  ...tasteRules,
  ...typographyRules,
  ...rootCauseRules,
  ...agentHarnessRules,
  ...responsiveRules,
  ...modalViewportRules,
  ...stackingRules,
  ...uxRules,
  ...accessibilityRules,
  ...securityRules,
  ...agentRules
];
