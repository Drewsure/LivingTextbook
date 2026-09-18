# ADR 0858: Local Bundle Accessibility Readiness Parity

## Status

Accepted for foundation rehearsal.

## Context

The shared asset evaluator correctly identifies missing transcript, poster, and
alt-text evidence, but the offline manifest validator and browser review must
enforce the same boundary. Otherwise a planning surface could imply that a
bundle is ready while another surface correctly blocks it.

## Decision

Require transcript evidence for offline-ready audio, poster and
transcript/caption evidence for offline-ready video, and alt-text evidence for
offline-ready images. Preserve asset identifiers and explicit blockers in the
review aggregate.

## Boundaries

This change does not read media, generate accessibility metadata, upload or
copy files, approve rights, write packages, activate offline mode, or promote
assets to students.

## Consequences

Manifest validation, shared evaluation, and teacher review now agree about
accessibility readiness. Planning manifests remain usable while incomplete
evidence stays visible and blocked.
