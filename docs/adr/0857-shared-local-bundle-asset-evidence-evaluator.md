# ADR 0857: Shared Local Bundle Asset Evidence Evaluator

## Status

Accepted for foundation rehearsal.

## Context

Asset evidence was visible in the preview, but readiness logic must not live
only in a UI component. Hosted and local package paths need identical answers
about rights, checksum, scan, mapping, and accessibility.

## Decision

Add `evaluateLocalBundleAssetEvidence` to the shared content model and make
the local evidence panel consume it. The evaluator returns each evidence lane,
the overall handoff result, and explicit blockers.

## Boundaries

The evaluator is pure. It does not read files, run scans, approve rights,
write mappings, create packages, activate offline mode, or promote assets to
students.

## Consequences

Future hosted/local package writers can reuse the same readiness contract. A
complete asset can be recognized consistently, while incomplete media remains
blocked for a specific, inspectable reason.
