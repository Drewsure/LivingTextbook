# DR-1349: Publisher Source Directory Preflight

Date: 2026-10-01
Status: Accepted

The first publisher handoff now has a deterministic source-folder preflight.
An explicit manifest declares each textbook, image, audio, video, transcript,
font, or game-background asset, its unit mapping, accepted types, and required
status. The command inventories the folder, calculates SHA-256 checksums, and
reports missing, unsupported, invalid, and unlisted files before quarantine.

The report remains blocked and review-only. It does not copy files, write
quarantine, promote assets, assemble packages, print QR codes, activate hosted
persistence, create learner records, or start students. It is the first
publisher-facing source handoff step for the saleable white-label pilot.

See ADR 1350 and `docs/PRINCIPLES_AND_STANDARDS.md` section 593.

