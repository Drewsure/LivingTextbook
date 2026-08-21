# 2026-08-21: Build Stage Map Panel

Added a compact build stage map to `/teacher/intake`.

Changes:
- Added `sampleBuildStageMap` as a review-only data model for build-stage status.
- Added `BuildStageMapPanel` to show foundation structure, active route shell readiness, backend contract status, pilot blockers, game design timing, and Z.ai intake gating.
- Added route-verifier markers for the new panel.

Boundaries:
- No live workflow action was added.
- No backend persistence, upload, report export, classroom launch, assignment activation, or school policy acceptance was enabled.
- No Z.ai code import or prototype intake was authorized.

Verification:
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
