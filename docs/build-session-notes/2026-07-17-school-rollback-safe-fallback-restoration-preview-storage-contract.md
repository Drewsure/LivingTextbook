# 2026-07-17: School Rollback Safe Fallback Restoration Preview Storage Contract

## Added

- Backend-neutral `school_rollback_safe_fallback_restoration_preview` schema contract.
- Migration candidate `m048-school-rollback-safe-fallback-restoration-preview-records`.
- Migration spec `spec-school-rollback-safe-fallback-restoration-preview`.
- Hosted and local adapter write intents.
- Durable record and persistence boundary coverage.
- Backend storage and active-route verifier coverage.

## Guardrail

This remains a storage contract only. It does not create restore buttons, restored markers, QR restoration, local package restoration, media restoration, report export, classroom restart, notification, or student reassignment workflows.
