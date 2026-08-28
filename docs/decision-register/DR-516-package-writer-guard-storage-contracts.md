# DR-516: Package Writer Guard Storage Contracts

Status: Accepted

Date: 2026-08-28

Decision: Add backend-neutral storage contracts for route/playlist write guards and local companion package guards.

White-label impact: Positive. Generated package writer guard evidence can be persisted consistently for hosted, installed PWA, desktop, and local-classroom deployments without selecting one storage vendor too early.

Cost impact: Positive. Persisted review records lower future support cost by making route, playlist, QR, media, local package, student-data, school-policy, and rollback responsibilities auditable before live writes exist.

Constraints:

- Route/playlist guard storage must preserve protected surfaces, route safety checks, playlist safety checks, QR mutation blocks, target-language audio checks, and support-language route approval blocks.
- Local companion guard storage must preserve protected local artifacts, local safety checks, offline fallback checks, student data exclusion, school policy requirements, rollback checkpoints, and support-language local approval blocks.
- Storage contracts must remain backend-neutral and must not enable route writes, playlist writes, media copy, local bundle export, assignment activation, student-ready markers, or support-language-only approval.
