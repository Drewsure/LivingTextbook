# ADR 0709: Completion Key Identity Binding

## Status

Accepted for foundation hardening.

## Decision

Every progress-event completion write request must carry the structured
canonical completion identity alongside its idempotency key. The runtime
validator derives the expected key from tenant, unit, launch, student session,
and game mode and rejects a key that does not match.

## Rationale

A non-blank key only proves that a caller supplied a string. Binding the key to
structured identity prevents cross-tenant, cross-unit, cross-launch, or
cross-session deduplication caused by stale or tampered caller data.

## Boundary

The validator remains provider-neutral and side-effect free. It does not enable
live writes or bypass event, audio, scoring, mastery, reward, policy, release,
or tenant gates.

## Verification

The runtime behavior harness covers a valid identity/key pair and rejects a
key generated for a different unit.
