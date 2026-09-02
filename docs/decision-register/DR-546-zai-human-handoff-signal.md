# DR-546: Z.ai Human Handoff Signal

Status: Accepted

Date: 2026-09-02

Decision: Extend the Z.ai prototype intake alert with explicit human handoff timing.

## Rationale

- The user is building daily with Z.ai and needs a clear signal for when to involve Codex.
- The right current behavior is continued isolated prototyping, not handoff or integration.
- The alert should explain what is not needed yet so the foundation build can stay focused.

## Guardrails

- No Z.ai source handoff requested yet.
- No Phaser import requested yet.
- No archive upload requested yet.
- No pull request requested yet.
- No app patch requested yet.
- No route replacement.
- No scoring mutation.
- No package promotion.
- No student assignment.

## Verification

- `npm.cmd run verify:prototype-review`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
