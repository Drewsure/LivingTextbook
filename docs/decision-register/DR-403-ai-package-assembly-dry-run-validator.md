# DR-403: AI Package Assembly Dry-Run Validator

Date: 2026-08-11

## Decision

AI-generated package assembly dry runs now use a shared content-model validator before future package-writer work can treat the artifact map as structurally valid.

## Rationale

The generator page previews package JSON, route registry, playlist, local companion, and assignment artifacts. Those previews are useful, but they must not drift into hidden writes or student-ready shortcuts. A shared validator keeps the dry run review-only and blocks unsafe write actions in one reusable place.

## Rules Preserved

- Dry-run status stays blocked in the foundation.
- Required artifacts include package, route, playlist, local companion, and assignment previews.
- Every artifact keeps blocked writes.
- Package JSON writes, route registry writes, media playlist writes, local bundle writes, assignments, student-ready markers, and support-language-only assembly dry runs remain blocked.
- Support-language boundaries remain explicit and cannot satisfy assembly.

## Consequences

The generator pages show `Dry-run guard active`, `Dry-run guard blocks`, and `Dry-run guard warnings`. `verify:ai-generator` fails if the shared validator or visible guard labels disappear.
