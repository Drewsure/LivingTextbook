# ADR 0848: Provider-Neutral Persistence Adapter Seam

## Status

Accepted for foundation architecture.

## Decision

Place process-memory rehearsal and server-only SQLite progression storage behind
one provider-neutral persistence adapter interface. The API routes may consume
the adapter, but may not select or own a concrete storage implementation.

## Rationale

The white-label platform needs to support a closed/local product and a future
hosted managed provider without changing the student progression contract. A
single adapter seam keeps provider selection server-owned and prevents storage
details from leaking into QR onboarding, scoring, audio, route handoff, or
teacher reporting.

## Guardrails

- Provider selection is deployment configuration, not browser input.
- SQLite construction is delayed until the durable policy and authorization
  gates have passed.
- Process-memory remains explicitly non-durable rehearsal.
- The adapter preserves tenant identity, idempotency, and existing validation.
- No provider credentials are returned to the browser.

## Consequences

Future hosted relational, local package, or another approved provider can be
implemented behind the same interface. The adapter seam is not itself a cloud
selection or a production-write authorization.

See `docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md` and
`docs/decision-register/DR-920-provider-neutral-persistence-adapter-seam.md`.
