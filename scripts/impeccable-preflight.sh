#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Intake gate: creating intake artifact if missing"
node "$SCRIPT_DIR/intake-session.mjs" || true

echo "Standards search gate: creating standards search brief"
node "$SCRIPT_DIR/standards-search-brief.mjs" PRODUCT.md DESIGN.md || true

echo "Mandatory setup: installing Impeccable for this harness"
if npx impeccable skills install; then
  echo "Impeccable install completed"
else
  echo "Impeccable install failed or is unavailable. Continue manually, but keep npx impeccable skills install in DESIGN.md as the required setup command."
fi

echo "Recommended companion: Vibe Driven Dev (pre-execution layer)"
if command -v vdd >/dev/null 2>&1; then
  echo "VDD detected. You can run: vdd doctor && vdd run /vibe.start"
  if [ -f "PRD.full.md" ] || [ -f "PRD.draft.md" ] || [ -f "Scope.md" ] || [ -f "Stack-Decision.md" ]; then
    echo "VDD artifacts found (PRD/Scope/Stack). Reuse them as intake inputs instead of re-asking."
  fi
else
  echo "VDD not installed. Recommended when idea/scope/stack is unclear: npm install -g vibe-driven-dev (or npx vibe-driven-dev install claude-code --project). Optional, not a blocker."
fi

echo "Creating starter design artifacts if missing"
node "$SCRIPT_DIR/bootstrap-design-artifacts.mjs"

echo "Validating DESIGN.md"
node "$SCRIPT_DIR/validate-design-md.mjs" DESIGN.md || true

echo "Scoring DESIGN.md"
node "$SCRIPT_DIR/score-design-md.mjs" DESIGN.md PRODUCT.md || true

if [ -d "src" ]; then
  echo "Running Impeccable detector on src/"
  npx impeccable detect src/ || true
  echo "Scanning frontend implementation"
  node "$SCRIPT_DIR/scan-ui-implementation.mjs" src || true
else
  echo "No src/ directory found. Skipping source scanners."
fi

if [ -f "DESIGN.legacy.md" ]; then
  echo "Amplify Mode source detected: DESIGN.legacy.md"
  node "$SCRIPT_DIR/amplify-design-md.mjs" DESIGN.legacy.md PRODUCT.md DESIGN.amplified.md DESIGN.amplification-report.md || true
fi

echo "Rules engine gate"
node "$SCRIPT_DIR/run-gates.mjs" DESIGN.md PRODUCT.md src || true

echo "Preflight complete. In the agent harness, run slash commands when available:"
echo "/impeccable init"
echo "/impeccable document --seed or /impeccable document"
echo "/impeccable shape"
echo "/impeccable craft"
