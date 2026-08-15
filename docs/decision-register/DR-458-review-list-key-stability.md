# DR-458: Review List Key Stability

Date: 2026-08-15

## Decision

Teacher/admin review surfaces should not use visible text alone as React keys for repeated checklist, blocker, warning, or evidence rows.

## Rationale

The foundation UI intentionally repeats phrases such as blocked actions, required evidence, storage records, and policy gates across upload, media, evidence, and persistence panels. Text-only keys can collide and create console warnings or unstable row identity.

## Consequences

- Upload, evidence, Labelled Diagram asset, media asset, and teacher media review panels now use contextual keys for repeated string lists.
- Future review panels should use stable record ids first, then a context plus index for plain string lists.
- Random, timestamp, or locale-derived keys remain disallowed.

## Non-Goals

- This does not change storage, scoring, upload behavior, or student routes.
- This does not add visual polish.
