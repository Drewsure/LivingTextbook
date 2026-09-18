# DR-908: Teacher Report Rehearsal Surface

## Decision

Expose the shared teacher report persistence rehearsal on the reporting
workbench and per-session report-package previews. Keep the component visibly
review-only, no-side-effect, and live-export-blocked.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`

## Excluded

Provider selection, report writes, exports, policy acceptance, learner identity
promotion, and release-state mutation.
