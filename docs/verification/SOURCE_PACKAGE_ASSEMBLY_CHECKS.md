# Source Package Assembly Checks

The source-to-package bridge is accepted only when:

- valid MiniStar and partner packets pass shared validation;
- review-only mode is enforced;
- required extraction, draft, and review-handoff records are present;
- promotion flags cannot be enabled;
- the intake page shows candidate units, media, and open blockers;
- source runtime, runtime behavior, typecheck, build, and active routes pass.

Passing this check does not authorize upload, extraction, draft persistence,
package release, QR activation, or student assignment.
