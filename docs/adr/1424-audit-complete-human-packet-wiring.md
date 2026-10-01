# ADR 1424: Prove Complete Human Packet Wiring In The Pilot Audit

## Decision

Extend the first-pilot audit self-test with a complete synthetic external
human-evidence packet. The self-test must confirm that valid delivery policy,
reviewed package evidence, and release authorization records each advance
their corresponding audit gate while the audit still remains non-saleable when
real publisher and outside-builder evidence is absent.

## Rationale

The individual human-evidence validator already checks each record and their
identity binding. The saleability audit is a separate composition boundary and
must prove that it consumes those results correctly. This catches wiring
regressions without fabricating a commercial approval or placing sample
evidence in the repository.

## Safety boundary

The self-test uses temporary synthetic records only. It writes no pilot
evidence into the repository, cannot authorize release, and must continue to
return a non-success audit status when publisher source, Z.ai candidate, or
other required human evidence is missing.

## Verification

`node scripts/audit-first-saleable-pilot.mjs --self-test`

`node scripts/verify-foundation-composition.mjs`
