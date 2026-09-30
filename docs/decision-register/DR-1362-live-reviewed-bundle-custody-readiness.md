# DR-1362: Bind Reviewed Bundle Custody Into Live Readiness

## Decision

The live publisher package-readiness route reads the exact reviewed local
bundle-manifest custody record from the source-preflight version and validates
all live package lineage identities before satisfying the reviewed-manifest
assembly input.

## Guardrails

- Metadata-only response.
- No manifest body or filesystem path exposure.
- Missing, stale, or mismatched custody remains blocked.
- Assembly, promotion, QR printing, hosted persistence, learner records, and
  student activation remain disabled.

## Evidence

See `docs/adr/1362-live-reviewed-bundle-custody-readiness.md` and the focused
publisher delivery assembly preview verifier.
