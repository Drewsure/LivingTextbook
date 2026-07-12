# 2026-07-12: Local Bundle Readiness Verifier

## Summary

Added automated local bundle readiness verification for the MiniStar and sample publisher planning manifests. The foundation check now fails if local bundle routes, artifacts, QR fallback, checksums, release gates, or offline-readiness blockers drift out of alignment.

## Verification

- `npm run verify:local-bundle`

## Notes

- This does not create an installer or offline package.
- It protects the closed/local companion strategy by keeping the current sample package explicitly preview-only.
- The rule is intentionally conservative because local handoff involves media rights, updates, reporting, backup, and school policy.
