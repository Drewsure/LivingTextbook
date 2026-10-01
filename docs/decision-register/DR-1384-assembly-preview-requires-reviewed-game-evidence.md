# DR-1384: Assembly Preview Requires Reviewed Game Evidence

## Decision

Require complete reviewed package evidence and complete canonical game
evidence as explicit inputs to the local/hosted assembly request preview.

## Consequences

- Package assembly cannot appear ready from infrastructure metadata alone.
- The publisher's reviewed multimedia/game promise is represented at the
  writer boundary.
- The preview remains non-executing and all release gates remain separate.

## Verification

`node scripts/verify-publisher-delivery-assembly-request-preview.mjs`

`npm run verify:foundation-composition`
