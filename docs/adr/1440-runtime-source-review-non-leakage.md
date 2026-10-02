# ADR 1440: Runtime Source-Review Non-Leakage

## Status

Accepted

## Decision

The active route verifier must inspect the rendered response for
`/teacher/sources/white-label-review` and reject MiniStar or sample-publisher
source labels, identifiers, and media records. The route must remain a
tenant-empty, review-only workspace until the publisher supplies its own
source package.

## Consequences

- A generic tenant cannot pass route verification merely by returning HTTP 200.
- Reference fixture leakage becomes an observable regression rather than an
  inferred risk.
- The check does not write files, extract source material, promote packages, or
  activate learners.

## Verification

`npm run verify:routes:preview` must pass the generic route with the forbidden
reference markers absent.
