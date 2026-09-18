# ADR 0839: Persistence Handoff Behavior Verification

## Status

Accepted for foundation hardening.

## Decision

Include the shared persistence handoff validator in the runtime behavior
harness. The harness must prove a valid review-only packet, reject provider
injection, and reject missing tenant-bound category coverage.

## Rationale

Static markers can prove that a validator exists but cannot prove that it
rejects an unsafe or incomplete packet. Behavioral checks protect future web,
AI-service, and local-companion consumers from silently weakening the
provider-neutral boundary.

## Excluded

This verification does not select a provider, perform storage, export data,
run migrations, or authorize a pilot.
