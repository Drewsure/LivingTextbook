# DR-1240: Controlled Local Pilot Package Assembly

## Decision

Implement a gated local package assembler as the next step toward the first
saleable white-label pilot. Keep it separate from the metadata-only delivery
writer and require real approved evidence before it can write.

## Why

The publisher needs a tangible package containing reviewed textbook content,
multimedia, route metadata, and curated game references. A metadata index alone
cannot be handed to a school as the local companion package.

## Guardrails

- Explicit write flag, package root, approved asset root, and delivery token.
- Approved manifest, receipt, package index, and offline-ready bundle manifest.
- All required source, rights, audio, QR, local, teacher, and release gates.
- Explicit file list only; no recursive or quarantine-root promotion.
- Realpath and lexical boundary checks for source and destination.
- Staged write, read-back validation, checksum verification, atomic commit.
- Idempotent identical replay; conflict on mismatch or partial output.
- No learner records, hosted activation, QR mutation, or student activation.

## Current State

The adapter and verification contract are implemented. The sample remains
blocked by design because it does not contain real publisher evidence or
release approval.

## Next Human Evidence

Provide a real publisher unit package, rights/accessibility decisions, approved
asset-root placement, rollback reference, and named reviewer approval before
enabling a controlled rehearsal.
