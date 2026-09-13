# ADR 0706: Cross-Layer Completion Idempotency Alignment

## Status

Accepted for foundation hardening.

## Decision

The persistence alignment validator must compare the canonical completion
idempotency contract across durable records and hosted/local adapter intents.
It must prove that both layers declare the same key fields and the same
duplicate-rejection and atomic-write requirements.

This is a provider-neutral contract check. It does not select a database,
enable live writes, or replace school-policy and release gates.

## Rationale

Validating each layer independently is insufficient: a provider adapter could
pass its own shape check while silently dropping `game_mode`, disabling atomic
duplicate handling, or changing retry semantics. Cross-layer comparison makes
that drift visible before an adapter is selected.

## Verification

The runtime behavior harness covers an aligned progress-event record, a missing
key-field mismatch, and an atomicity mismatch. Backend readiness continues to
verify the sample schema, migration candidates, and migration specifications.
