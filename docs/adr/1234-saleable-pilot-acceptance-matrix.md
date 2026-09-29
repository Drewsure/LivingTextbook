# ADR 1234: Saleable Pilot Acceptance Matrix

## Status

Accepted as the completion standard for the first white-label pilot.

## Decision

Use one requirement-level matrix to determine whether the first publisher pilot
is saleable. The matrix covers the complete chain from source intake to
reviewed package, QR printing, teacher-led onboarding, student progression,
closed-local delivery, opt-in hosted persistence, tenant separation, and
external-game integration.

## Rationale

The platform already contains many strong review surfaces. Without one
acceptance record, those surfaces could be mistaken for a finished product.
The matrix makes the remaining human evidence and release decisions explicit
and prevents a demo route from being treated as production approval.

## Guardrails

- No real learner data or production QR print until the relevant row is closed.
- Hosted persistence remains opt-in and provider-gated.
- Local delivery remains blocked until media, rights, checksums,
  installer/update, recovery, and device evidence are complete.
- Frozen Z.ai/Phaser code remains isolated until its complete evidence return
  package and integration adjudication exist.

## Verification

Run the matrix's stated focused verifiers and the foundation composition gate,
then complete the required human browser rehearsal before marking the pilot
saleable.
