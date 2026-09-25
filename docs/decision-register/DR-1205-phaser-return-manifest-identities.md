# DR-1205: Phaser Return Manifest Identity Boundaries

The external Phaser return-package verifier now requires bounded safe tenant,
request, queue, and artifact identities, and bounded safe relative paths.
Malformed package metadata fails before evidence adjudication. The candidate
remains review-only and no source, route, scoring, persistence, or assignment
authority is enabled.

References: ADR 1205 and the 2026-09-25 Phaser return manifest identity build
session.
