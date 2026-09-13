# ADR 0707: Provider-Neutral Completion Write Resolution

## Status

Accepted for foundation hardening.

## Decision

The content model exposes `planCanonicalCompletionWrite` as the shared
resolution contract for future hosted and local completion adapters:

- `create` when no completion exists for the canonical key.
- `return-existing` when the same key and payload hash are retried.
- `conflict` when the same key is paired with a different payload hash.
- `invalid` when required identity, payload, or record fields are missing.

The function is a pure planner. It does not write storage, select a provider,
or bypass policy, release, event, scoring, mastery, audio, or tenant gates.

## Rationale

Browser-level idempotence protects repeated callbacks during one session, and
the durable contract protects the key at the storage boundary. A shared
provider-neutral resolution step closes the remaining semantic gap so hosted
and local adapters handle retries and tampered payloads identically.

## Verification

The runtime behavior harness covers create, same-payload retry, payload-hash
conflict, and invalid candidate outcomes.
