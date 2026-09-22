# External Candidate Handoff Diagnostics

Date: 2026-09-23

The Phaser candidate verifier now explains that a frozen source snapshot is
not a returned evidence package when `evidence/return-package.json` is absent.
The check remains fail-closed and does not create a manifest, copy source, or
promote any candidate.
