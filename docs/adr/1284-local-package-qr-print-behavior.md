# ADR 1284: Exercise Local Package and QR Print Behavior

## Status

Accepted for foundation verification; production delivery remains manually gated.

## Context

The first saleable white-label pilot must be able to turn an approved publisher
package into a closed-local bundle and a printable QR sheet. Static readiness
checks are not enough for this boundary: a package writer can appear correct
while copying the wrong files, losing fallback routes, generating unusable QR
artifacts, or accepting unsafe print URLs.

## Decision

The foundation gate runs the real `assembleLocalPilotPackage` function in a
temporary custody root with a synthetic but fully approved package fixture. The
behavior rehearsal must prove:

- only approved content, media, and accessibility evidence are copied;
- the QR manifest and printable HTML contain generated SVG artifacts;
- each approved alias retains its local fallback path;
- an exact replay is accepted as idempotent;
- the writer is blocked when the explicit local write gate is disabled; and
- non-HTTP(S) print bases are rejected.

The rehearsal is isolated from product storage and creates no learner records.
It does not authorize production release, QR printing, student activation, or
hosted persistence. Human release approval, QR authorization, rights evidence,
device testing, and rollback evidence remain required for a real publisher.

## Consequences

The local delivery path now has executable evidence for the most important
publisher handoff behavior. The tradeoff is a small compiled runtime harness
that must remain aligned with the assembler and its content-model contracts.

## Verification

Run `npm run verify:local-pilot-package-assembler-behavior` or the complete
`npm run verify:foundation` gate.
