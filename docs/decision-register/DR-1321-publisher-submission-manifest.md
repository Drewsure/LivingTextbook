# DR-1321: Publisher Submission Manifest

Date: 2026-09-30  
Status: Accepted

The tenant-scoped upload workspace now exposes a reusable publisher submission
manifest before quarantine intake. It gives a publisher a concrete checklist
for textbook source, labelled images, audio/music, video/posters,
transcripts/captions, fonts, and optional game background media.

The manifest preserves target-language authority, support-language separation,
rights/accessibility requirements, and package identity. It is metadata only:
no file picker, promotion, QR mutation, package assembly, persistence
activation, or student-facing route can be triggered by the manifest itself.

See ADR 1322 and `docs/PILOT_EXECUTION_RUNBOOK.md`.
