import { readLoopState } from '../core/loopState.js';

export function loopCommand(args = []) {
  const action = args[0] || 'status';
  if (action === 'status') {
    const state = readLoopState();
    console.log(`[unslop loop] Active: ${state.active}`);
    return;
  }
  console.log(`[unslop loop] Command '${action}' executed.`);
}
