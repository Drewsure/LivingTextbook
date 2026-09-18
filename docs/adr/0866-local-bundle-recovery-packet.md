# ADR 0866: Local Bundle Recovery Packet

## Status

Accepted for foundation rehearsal.

## Context

Provider approval evidence names recovery as a required lane, but a generic
label is not enough to review a saleable white-label package. Local and hosted
recovery must be comparable without accidentally introducing a database,
filesystem writer, learner-data export, or cross-tenant restore path.

## Decision

Define `LocalBundleRecoveryPacket` as a provider-neutral, review-only contract.
It records backup manifest/checksum evidence, restore rehearsal and rollback
evidence, export policy and exclusions, and retention scope. It requires
SHA-256 evidence, excludes raw learner audio/transcripts from backup and
learner data/raw media/credentials from export, and blocks cross-tenant
restore. Provider selection and all execution or mutation actions remain
disabled.

## Consequences

The platform can compare local package recovery requirements before choosing a
vendor or storage implementation. Teachers and publishers can inspect the
evidence lanes, while the runtime remains fail-closed and no student or tenant
data is written, restored, exported, or promoted.
