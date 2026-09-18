# ADR 0868: Local Export And Retention Dry-Run

## Status

Accepted for foundation rehearsal.

## Context

Recovery and provider approval evidence identify export and retention as
required controls, but a future local package still needs a precise content
boundary. A manifest preview must not accidentally become a file copier,
learner-data export, or deletion worker.

## Decision

Define `LocalBundleExportRetentionDryRun` as a review-only classification
contract. It identifies metadata that may be described, learner progress that
requires policy, and raw learner audio, transcripts, and credentials that are
excluded. It requires tenant-package-session retention scope, policy-gated
deletion, `sideEffect: "none"`, and false execution/write/mutation flags.

## Consequences

Teachers and publishers can understand the future package boundary and policy
cost before a storage provider is chosen. The dry run remains diagnostic: it
cannot copy media, export records, delete retained data, write packages,
promote students, or mutate routes.
