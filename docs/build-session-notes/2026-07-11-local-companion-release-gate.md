# 2026-07-11: Local Companion Release Gate

## Summary

Added a local release gate to the sample publisher local companion preview. The gate makes the closed-package handoff decision explicit and shows pass, warning, and blocked items with owners, evidence, blockers, and next actions.

## Verification

- `npm run verify:foundation`
- `http://127.0.0.1:3000/local/sample-publisher`

## Notes

- This protects the white-label local companion path from being oversold before installer, update, media rights, backup, reporting, QR fallback, and school policy decisions are complete.
- The gate is sample data today, but it defines the shape of a future generated package release review.
