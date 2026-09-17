# ADR 0828: Server-Owned Persistence Policy

## Status

Accepted for foundation hardening.

## Context

The first persistence adapter is policy-gated, but a browser request previously
carried affirmative school, retention, release, and durable-write flags. Those
flags are not trustworthy attestations when they originate on a learner
device.

## Decision

Use a client request containing only tenant-scoped identity, the validated
continuity envelope, and a requested persistence mode. The server derives the
complete internal policy from deployment configuration, validates it, and only
then considers the selected provider. Client-supplied policy objects are
rejected.

Signed student-session or server-token authorization remains required for
durable operations, and all default gates remain disabled.

## Consequences

- Institutional policy cannot be forged by changing browser request fields.
- Provider implementations receive one validated internal shape.
- Enabling durable persistence still requires deliberate deployment and human
  release decisions.
