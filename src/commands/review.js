import { initReviewRound } from '../core/reviewRecorder.js';

export function reviewCommand(args = []) {
  const action = args[0] || 'status';
  console.log(`[unslop review] Executing review action: ${action}`);
}
