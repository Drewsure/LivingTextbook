# Build Session Note: Persistence Storage Selection Gate Visibility

Date: 2026-08-31

## Scope

Added the shared evidence storage adapter selection gate to the focused persistence workbench.

## Outcome

- `/teacher/persistence` now shows hosted, closed local, and hybrid evidence storage candidates beside schema, migration, boundary, and adapter-readiness panels.
- The route keeps hosted managed storage as the first pilot recommendation for cost control.
- Closed local evidence storage remains visible as a white-label requirement and premium/policy-gated path.
- No live upload, storage, signed URL, local folder, export, migration, local companion activation, or release mutation behavior was added.
- The evidence storage adapter list rendering now uses contextual keys for repeated review text.

## Verification

- `npm.cmd run verify:backend-storage`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
