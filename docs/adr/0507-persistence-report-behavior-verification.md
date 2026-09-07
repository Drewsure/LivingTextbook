# ADR-0507: Persistence And Teacher Report Behavior Verification

Status: Accepted

## Context

The platform needs teacher-visible progress summaries without accidentally making raw microphone recordings, transcripts, real learner identities, or unapproved exports part of the core product. Preview routes and static policy markers do not prove that a future provider will preserve those boundaries.

## Decision

Extend the local compiled-contract behavior harness to exercise persistence and teacher-report runtime boundaries.

The harness covers:

- raw learner audio rejection from core persistence;
- mutation/export approval rejection at persistence;
- real-identifier and raw-audio rejection from core teacher reports;
- review-only no-side-effect behavior for both adapters.

## Consequences

- Backend privacy decisions have executable evidence before provider selection.
- Hosted, local, and hybrid providers must share the same pseudonymous and media-exclusion rules.
- The harness performs no storage write, report export, identity promotion, provider call, or learner-data collection.
