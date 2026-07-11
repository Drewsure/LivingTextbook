# DR-130: Local Companion Package Handoff Checklist

## Decision

Add a package handoff checklist to the local companion preview route.

## Reason

A closed textbook companion needs more than a route and manifest. A publisher handoff must clearly separate source files, reviewed content packages, media rights, checksums, and school report policy before anyone treats the package as offline-ready.

## Standard

- `/local/sample-publisher` shows `Package handoff checklist`.
- Checklist items identify publisher, platform, and school owners.
- Each item names the expected artifact, why it is required, current status, and next action.
- Missing media rights, checksums, and report policy block offline-ready claims.
- Route verification checks the handoff checklist remains visible.
