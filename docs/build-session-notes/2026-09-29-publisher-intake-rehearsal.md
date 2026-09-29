# Build Session: Publisher Intake Rehearsal

## Slice

First saleable white-label pilot: synthetic publisher source through controlled
intake and live readiness review.

## Delivered

- Added `scripts/verify-publisher-intake-rehearsal.mjs`.
- Reused the real intake, handoff, readiness-binding, and review-packet APIs.
- Replayed source review, all eight package evidence lanes, delivery-mode
  selection, and live readiness after the package evidence record was captured.
- Added upload-review-token authorization to the live readiness read boundary.
- Kept package assembly, hosted persistence, QR printing, promotion, and
  student use blocked without human adjudication.

## Verification intent

The rehearsal must prove route continuity and privacy without creating a real
publisher package. It uses a temporary custody root and deletes it after the
server exits.

## Latest run

`npm run verify:publisher-intake-rehearsal` passed on 2026-09-29. The run
confirmed that complete synthetic package evidence closes only the source,
package-review, delivery-mode, and package-preview checks. Delivery, release,
QR printing, local assembly, hosted persistence, and student-facing activation
remained blocked.

## Next slice

Use the rehearsal evidence to define the first human adjudication handoff:
reviewer decision, package assembly authorization, and the explicit local
delivery manifest that can later drive QR printing.
