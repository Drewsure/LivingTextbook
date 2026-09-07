# ADR-0500: Recovery And Continuity Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral recovery runtime request/result contract and review-only adapter in the shared content model for backup, restore, export, and rollback planning.

## Required checks

The runtime validates tenant/package scope, operation, mode, requested state, persistence, backup manifest, checksum, encryption, access control, retention, school policy, report integrity, rollback, release approval, raw learner media exclusion, and local fallback evidence when required.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Backup creation, restore execution, export archive creation, package/media copy, learner-data recovery, QR/route mutation, and release rollback remain blocked.
- Hosted managed, local classroom, and hybrid continuity providers use the same contract.

## Verification

Run `npm run verify:recovery-runtime`, `npm run verify:foundation-composition`, AI service and web typechecks, production build, and full foundation verification.
