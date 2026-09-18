# Teacher Report Persistence Runtime Checks

This check proves the report runtime, persistence adapter intent, and durable
record contract agree before a provider-specific teacher reporting adapter is
considered.

## Required checks

- `npm run verify:report-runtime`
- `npm run verify:runtime-behavior`
- `npm run verify:backend-storage`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes` with the web server running

The runtime harness must prove:

- a structurally valid report package request is still denied in review-only
  mode with `sideEffect: "none"`;
- event-acceptance summaries and settings context are required by both the
  adapter intent and durable record;
- intent and durable record use the same tenant-boundary key;
- school or tenant policy, release approval, pseudonymous learner slots, and
  raw-audio/transcript exclusion remain explicit.
- the teacher reporting workbench and both tenant report-package previews expose
  the same review-only, no-side-effect, live-export-blocked state.

## Production boundary

This is not evidence of live report persistence. A hosted or local adapter
requires a separate provider review covering identity, retention, export,
backup/restore, tenant isolation, and incident handling.
