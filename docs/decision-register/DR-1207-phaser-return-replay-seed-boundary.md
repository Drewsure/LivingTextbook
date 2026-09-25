# DR-1207: Phaser Return Replay Seed Boundary

Returned Phaser event evidence now uses the same bounded `replay-v1` seed shape
as canonical games. Malformed or path-like seeds fail before replay review;
the candidate remains isolated and review-only.

References: ADR 1207 and the 2026-09-25 Phaser replay seed build session.
