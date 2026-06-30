import { listStandardsPacks, loadStandardsPack } from '../core/standardsPacks.js';

// ANSI coloring escape codes
const reset = '\x1b[0m';
const bold = '\x1b[1m';
const italic = '\x1b[3m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const gray = '\x1b[90m';

function useColor(flags) {
  return flags.noColor !== true;
}

/**
 * Handles the 'standards' command for listing and inspecting packs
 * @param {Object} context { cwd, args, flags }
 */
export async function standards({ cwd, args, flags }) {
  const sub = args[0];
  const color = useColor(flags);

  if (sub === 'list') {
    const packs = listStandardsPacks();
    if (flags.json) {
      console.log(JSON.stringify(packs, null, 2));
      return packs;
    }

    console.log(`\n${color ? bold + cyan : ''}Unslop Standards Packs${color ? reset : ''}`);
    console.log('Modular, opt-in engineering standards to enforce governance and prevent code quality decay.');
    console.log(`To inspect a pack, run: ${color ? cyan : ''}unslop standards inspect <pack-id>${color ? reset : ''}\n`);

    if (packs.length === 0) {
      console.log('No registered standards packs found.');
      return packs;
    }

    for (const pack of packs) {
      const statusColor = pack.status === 'experimental' ? (color ? yellow : '') : (color ? green : '');
      const riskColor = pack.risk === 'critical' ? (color ? red : '') : (color ? yellow : '');
      
      console.log(`  ${color ? bold + green : ''}${pack.id}${color ? reset : ''} - ${pack.name}`);
      console.log(`    ${color ? bold : ''}Status:${color ? reset : ''} ${statusColor}${pack.status || 'stable'}${color ? reset : ''} | ${color ? bold : ''}Risk:${color ? reset : ''} ${riskColor}${pack.risk || 'standard'}${color ? reset : ''}`);
      console.log(`    ${color ? bold : ''}Applies to:${color ? reset : ''} ${pack.appliesTo?.join(', ') || 'N/A'}`);
      console.log(`    ${color ? bold : ''}Categories:${color ? reset : ''} ${pack.categories?.join(', ') || 'N/A'}`);
      console.log('');
    }
    return packs;
  }

  if (sub === 'inspect') {
    const packId = args[1];
    if (!packId) {
      console.error(`${color ? red + bold : ''}Error:${color ? reset : ''} Please specify a standards pack ID. Example: unslop standards inspect vibe-coding`);
      process.exitCode = 1;
      return null;
    }

    try {
      const pack = loadStandardsPack(packId);
      if (flags.json) {
        console.log(JSON.stringify(pack, null, 2));
        return pack;
      }

      const { manifest, rules } = pack;
      console.log(`\n${color ? bold + cyan : ''}Standards Pack: ${manifest.name} (${manifest.id})${color ? reset : ''}`);
      console.log(`${manifest.description || 'No description provided.'}`);
      console.log('');
      console.log(`${color ? bold : ''}Target Contexts:${color ? reset : ''} ${manifest.appliesTo?.join(', ') || 'Any'}`);
      console.log(`${color ? bold : ''}Recommended for:${color ? reset : ''} ${manifest.recommendedFor?.join(', ') || 'N/A'}`);
      console.log(`${color ? bold : ''}Not Recommended for:${color ? reset : ''} ${manifest.notRecommendedFor?.join(', ') || 'N/A'}`);
      console.log('');

      console.log(`${color ? bold + cyan : ''}Enforced Rule Categories & Guidelines:${color ? reset : ''}`);
      for (const [category, ruleSet] of Object.entries(rules)) {
        console.log(`\n  ${color ? bold + green : ''}● Category: ${category.toUpperCase()}${color ? reset : ''}`);
        if (ruleSet.description) {
          console.log(`    ${color ? gray : ''}${ruleSet.description}${color ? reset : ''}`);
        }
        if (ruleSet.philosophy) {
          console.log(`    ${color ? italic : ''}Philosophy:${color ? reset : ''} "${ruleSet.philosophy}"`);
        }

        const list = ruleSet.rules || [];
        if (list.length === 0) {
          console.log('    (No rules loaded for this category)');
        }
        for (const rule of list) {
          console.log(`\n    [${color ? bold + yellow : ''}${rule.ruleId || 'RULE'}${color ? reset : ''}] ${color ? bold : ''}${rule.name}${color ? reset : ''}`);
          console.log(`      ${rule.description}`);
          if (rule.guidelines && rule.guidelines.length > 0) {
            console.log(`      ${color ? bold : ''}Guidelines:${color ? reset : ''}`);
            for (const g of rule.guidelines) {
              console.log(`        - ${g}`);
            }
          }
        }
      }
      console.log('');
      return pack;
    } catch (e) {
      console.error(`${color ? red + bold : ''}Error:${color ? reset : ''} ${e.message}`);
      process.exitCode = 1;
      return null;
    }
  }

  // Fallback / Usage instruction
  if (flags.json) {
    console.log(JSON.stringify({ error: 'Subcommand must be list or inspect' }));
    process.exitCode = 1;
    return null;
  }

  console.log(`\n${color ? bold + cyan : ''}Unslop Standards Management${color ? reset : ''}`);
  console.log(`Usage:`);
  console.log(`  unslop standards list                List all available standards packs`);
  console.log(`  unslop standards inspect <pack-id>   Inspect details of a specific pack`);
  console.log('');
  return null;
}
