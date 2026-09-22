# DR-1063: Fail-Closed Sample Launch Resolution

Decision: exact reviewed launch-code registration is required before a sample
tenant/package context can be resolved.

Required invariants:

- `demo-unit-1` resolves only to the reviewed MiniStar sample package.
- `partner-demo-unit-1` resolves only to the reviewed sample-publisher package.
- Unknown codes and guessed `partner-*` prefixes do not fall back to either
  tenant.
- The boundary remains review/demo-only until a durable tenant route registry
  and release-controlled QR workflow exist.

Evidence: `apps/web/src/data/sampleLaunchResolver.ts` and ADR 0991.
