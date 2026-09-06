# ADR-0492: Teacher Report Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral teacher report runtime request/result contract and a review-only adapter in the shared content model.

## Required checks

The runtime validates tenant and launch-session alignment, approved format and scopes, the shared progress-event taxonomy, pseudonymous learner identity, raw-audio/transcript exclusion, teacher role, policy, persistence, explicit export approval, and release approval.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Core reports cannot export raw learner audio, transcripts, real learner identifiers, progression mutations, or reward mutations.
- Hosted managed, local classroom, and hybrid report providers must use the same runtime contract.

## Verification

Run `node scripts/verify-report-runtime.mjs`, typecheck, production build, and foundation verification.
