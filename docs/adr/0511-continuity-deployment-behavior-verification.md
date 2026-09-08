# ADR-0511: Continuity And Deployment Behavior Verification

Status: Accepted

## Context

The platform is hosted-first but may later offer closed local or hybrid classroom packages. Recovery behavior must distinguish hosted provider evidence from local fallback evidence without allowing any path to execute storage or restore work during foundation.

## Decision

Execute hosted-managed and non-hosted recovery behavior in the compiled foundation harness.

The harness covers:

- non-hosted recovery rejection without reviewed local fallback evidence;
- hosted recovery validation with the hosted fallback exception;
- review-only no-side-effect behavior for both paths.

## Consequences

- Deployment options remain white-label configurable without weakening safety gates.
- Local/hybrid work is not promised until fallback evidence is reviewed.
- The harness performs no backup, restore, export, package copy, route mutation, or learner-data recovery.
