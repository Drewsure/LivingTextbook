# ADR 1323: Publisher Submission Review Handoff

Date: 2026-09-30  
Status: Accepted

## Decision

The publisher submission manifest now derives a review-only handoff that maps
every source, image, audio, video, transcript, font, and background-media item
to one named evidence lane. The handoff links the publisher intake workspace
to the tenant evidence index and evidence handoff preview without duplicating
or promoting files.

Each lane remains `awaiting-evidence` until quarantine review, rights,
accessibility, language, and package evidence are complete. The handoff keeps
file promotion, evidence export, signed approval, QR printing, and
student-facing use blocked.

## Consequences

- Publishers can see exactly what evidence belongs to each submitted asset.
- Reviewers can follow one package identity from intake to evidence review.
- White-label tenants retain their own routes and language configuration.
- The bridge is intentionally not a file uploader or release workflow.
- The existing quarantine and evidence packet contracts remain the authority
  for later storage and release decisions.

## Verification

`npm run verify:publisher-submission-review-handoff` validates manifest parity,
lane completeness, internal routes, and blocked actions. The route is also
covered by the active route preview and full foundation verification.
