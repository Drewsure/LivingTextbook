# Stable Review Timestamp Standard

## Purpose

Teacher evidence, adjudication, persistence-access, and release-review timestamps
are audit context. They must render identically during server rendering and in
the browser so a review surface cannot produce hydration warnings or ambiguous
cross-time-zone evidence.

## Rules

- Use the shared web formatter at `apps/web/src/lib/formatStableTimestamp.ts`.
- Render review timestamps in UTC with an explicit `UTC` suffix.
- Keep learner-facing language localization separate from audit timestamps.
- Invalid or missing values must produce an explicit safe fallback, not a
  browser-dependent string.
- Do not use `toLocaleString`, `toLocaleDateString`, or `toLocaleTimeString` on
  the governed review surfaces.
- This standard changes presentation only. It does not change event times,
  persistence, release decisions, or teacher permissions.

## Verification

`npm run verify:review-keys` checks the governed timestamp surfaces together
with tenant-owned list identity. The full `npm run verify:foundation` gate must
still pass before a review or release claim is made.
