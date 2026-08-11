# DR-404: AI Package Writer Preflight Validator

Date: 2026-08-11

## Decision

AI-generated package writer preflights now use a shared content-model validator before future package-writer implementation work can treat writer targets as structurally valid.

## Rationale

The writer preflight names future writer targets for package JSON, route registry, media playlist, local companion, assignment shell, and rollback maps. Naming those targets is valuable, but it must not imply writer execution is allowed. A shared guard keeps target maps review-only and blocks implementation shortcuts.

## Rules Preserved

- Writer preflight status stays blocked in the foundation.
- Required writer targets include package, route, playlist, local companion, assignment, and rollback writers.
- Every target keeps required evidence and blocked writes.
- Writer execution, package commits, route mutation, playlist creation, local bundle packaging, assignment activation, student-ready markers, and support-language-only package writers remain blocked.
- Support-language boundaries remain explicit and cannot trigger writer work.

## Consequences

The generator pages show `Writer preflight guard active`, `Writer preflight guard blocks`, and `Writer preflight guard warnings`. `verify:ai-generator` fails if the shared writer preflight validator or visible guard labels disappear.
