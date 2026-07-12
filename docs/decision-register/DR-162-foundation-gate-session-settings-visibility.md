# DR-162: Foundation Gate Session Settings Visibility

## Decision

Add teacher-session settings safety to the visible foundation verification gate.

## Rationale

The new verifier protects classroom-critical settings. It should be visible to non-technical review on `/teacher/intake`, not hidden only in scripts.

## Accepted Direction

- Add `npm run verify:session-settings` to the foundation gate panel data.
- Update route verification to check the visible command and panel label.
- Refresh the verification checklist and local sync runbook.

## Follow-Up

Keep the foundation gate panel aligned whenever `npm run verify:foundation` gains or loses a focused verifier.
