# ADR 1232: Bind Publisher Preview To Exact Readiness Identity

## Status

Accepted for the first white-label pilot foundation.

## Decision

The publisher package preview stores the exact package-readiness reconciliation
identity and its source, evidence, publish, and assignment references. A shared
validator compares those references and the source checksum against the
reconciliation before the handoff is considered coherent.

## Consequence

Replacing a source or media record without refreshing the package evidence
binding now produces an explicit drift finding. This protects yearly textbook
updates, QR review, and release review from stale evidence.

The binding remains review-only and has no storage or release side effects.
