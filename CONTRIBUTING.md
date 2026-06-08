# Contributing to Vibe Design MD Architect

Thank you for improving this skill. This guide explains how to add a gate, update a scanner rule, improve a template, or submit a bug fix.

---

## Adding a new gate

Gates are hard-blocking rules that prevent implementation until a design artifact passes. Follow these steps when adding a gate:

### 1. Assign a gate number

Gate numbers are sequential. Check the current highest number in `SKILL.md` under **Strict Rules Engine** → Hard-blocking rule groups. Use the next integer.

### 2. Add the gate section to `SKILL.md`

Add a new `## [Gate Name] (Gate N)` section after the last existing gate section. Include:

- What failure pattern the gate prevents
- Required behavior (what must be true before implementation proceeds)
- Forbidden patterns (with code examples where helpful)
- A QA checklist (what to verify manually)
- A pointer to any new reference file if one is needed

Add the gate name to the hard-blocking rule groups list.

### 3. Create or update a reference file

If the gate needs a detailed reference, create `references/<gate-topic>.md`. Keep it focused — one topic per file. Reference files are read by the agent and must not duplicate `SKILL.md` verbatim.

### 4. Add scanner rules (optional but recommended)

Open `scripts/scan-ui-implementation.mjs` or `scripts/scan-accessibility.mjs` and add detection rules:

- **Blockers** (`severity: 'blocker'`): patterns that hard-fail the gate run.
- **Warnings** (`severity: 'warning'`): patterns worth flagging but not blocking.

Each rule needs: an ID (e.g. `G1`, `V6`, `M3`), a description, a pattern to match, and a corrective message.

### 5. Update `scripts/run-gates.mjs`

If the gate involves design-level checks (not just source scans), add the check logic to `run-gates.mjs`. Keep checks focused and fast.

### 6. Update `assets/qa-checklist.md`

Add a QA section for the new gate with checkbox items. Keep it implementation-focused: what would a reviewer check, not what the rule says.

### 7. Update `assets/DESIGN.template.md`

If the gate requires new fields in `DESIGN.md`, add placeholder sections or tables to the template so the coding agent produces them by default.

### 8. Update `assets/implementation-prompt.template.md`

Add a brief instruction in the implementation prompt so the coding agent is told what the gate requires before it starts writing code.

### 9. Add an entry to `CHANGELOG.md`

Follow the existing format:

```markdown
## vN.N  -  Gate Name (YYYY-MM-DD)

### Added
- Gate N: [short description of what the gate prevents and what it requires]
- `references/<file>.md`: ...
- `SKILL.md`: ...
- `scripts/...`: ...
- `assets/...`: ...

### Technical references
- [relevant standards and docs]
```

### 10. Update `README.md`

Add the new gate to the Gates table. Format: `| N | Gate Name | One-line purpose |`

---

## Updating an existing gate

- Make changes to `SKILL.md` and the relevant reference file.
- Update `assets/qa-checklist.md` if checklist items change.
- Update `CHANGELOG.md` with a `### Changed` or `### Strengthened` entry.
- Do not change gate numbers. Gates are stable references.

---

## Fixing a scanner rule

1. Open the relevant script (`scan-ui-implementation.mjs` or `scan-accessibility.mjs`).
2. Find the rule by its ID or pattern.
3. Fix the regex or logic, update the corrective message if the advice changed.
4. Test against a small source file that triggers the rule.

---

## Improving a template

Templates live in `assets/`. They are used by the agent to produce starter files. Keep templates:

- Complete enough to be immediately useful.
- Light enough that the agent fills in product-specific details, not generic placeholders.
- Consistent with the `DESIGN.md` six-section contract: Overview, Colors, Typography, Elevation, Components, Do's and Don'ts.

---

## PR checklist

Before opening a pull request, verify:

- [ ] Gate number is sequential and unused.
- [ ] `SKILL.md` section is complete: description, required behavior, forbidden patterns, QA checklist.
- [ ] Reference file created or updated if needed.
- [ ] Scanner rule added or updated if the gate is detectable statically.
- [ ] `qa-checklist.md` updated.
- [ ] `DESIGN.template.md` updated if new DESIGN.md fields are required.
- [ ] `implementation-prompt.template.md` updated if the coding agent needs new instructions.
- [ ] `CHANGELOG.md` entry written.
- [ ] `README.md` gate table updated.
- [ ] No gate is removed or renumbered.
- [ ] No existing `DESIGN.md` that passes all previous gates starts failing because of this change (backward compatible unless documented as a breaking change).

---

## Code style

- Scripts use ES modules (`type: "module"` in `package.json`). Use `.mjs` extension.
- No external runtime dependencies. Scripts must run with plain Node.js and no install step (except `playwright` which is optional).
- Keep scripts readable and commented. They are read by agents as well as humans.
- Use `process.exit(1)` for blocker failures and `process.exit(0)` for warnings-only or clean runs.

---

## Questions

Open an issue with the `question` label or start a discussion.
