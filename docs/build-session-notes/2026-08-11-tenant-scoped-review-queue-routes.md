# Tenant-Scoped Review Queue Routes

Date: 2026-08-11

Added tenant-scoped draft review queue routes:

- `/teacher/review/sample-publisher`
- `/teacher/review/ministar`

The existing `/teacher/review` route remains a global preview. The tenant routes filter queue items by tenant, preserve all verifier/evidence/package-writer/release/assignment blockers, and add route verification that fails if one tenant route leaks the other tenant's generated draft content.

Verification required:

- `npm.cmd run verify:teacher-authoring`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:routes`
