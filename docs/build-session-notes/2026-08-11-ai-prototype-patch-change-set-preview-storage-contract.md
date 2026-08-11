# 2026-08-11 - AI prototype patch change set preview storage contract

Added backend-neutral storage coverage for AI prototype patch change set previews.

What changed:

- Added `ai_prototype_patch_change_set_preview` to the backend schema draft and migration planning data.
- Added durable record and hosted/local adapter intent coverage for `ai-prototype-patch-change-set-preview`.
- Added content-model validation for planned file changes, invariant checks, review blockers, next records, and blocked actions.
- Added backend storage and route verification checks.
- Updated generator, backend, build-session, verification, ADR, and decision-register documentation.

Standing rule:

Change-set storage is not patch execution. Apply-patch actions, app file writes, generated file writes, tests, Playwright runs, route writes, scoring/reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress stay blocked until a separate future implementation decision exists.
