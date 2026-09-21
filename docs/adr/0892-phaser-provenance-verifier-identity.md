# ADR 0892: Phaser Provenance Verifier Identity

## Status

Accepted

## Decision

Use the shared content-model source identity module as the authority for the
frozen Phaser snapshot tag and commit used by the read-only evidence verifier.
The verifier still reads the review packet for its declared file manifest, but
identity must not drift through duplicated fixture constants.

## Consequences

- Updating the approved frozen identity occurs in one governed content-model
  boundary and is caught by the verifier contract check.
- The extracted snapshot remains outside the canonical application and cannot
  be promoted by this verifier.
- Missing or mismatched source files continue to fail closed.

## Verification

Run `npm run verify:phaser-source-evidence` with the isolated review root and
`npm run verify:phaser-source-evidence-contract`.
