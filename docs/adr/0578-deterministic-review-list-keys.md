# ADR 0578: Deterministic Review List Keys

Status: Accepted

## Decision

Teacher-facing warning and error lists must use deterministic keys that remain
unique when the same message appears more than once. Message-only keys are not
permitted for repeated review output.

## Context

Policy and persistence validators can legitimately produce repeated text from
different records. Message-only React keys caused duplicate-key warnings and
could make review output appear duplicated or disappear during updates.

## Consequences

- Repeated policy, persistence, session, and draft warnings render safely.
- Domain records continue to use their own stable IDs where available.
- This is a UI rendering safeguard only; it does not suppress or deduplicate
  the underlying evidence.

## Verification

The web typecheck, production build, active route checks, and focused review
surface checks remain required after changes to list rendering.
