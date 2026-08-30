# Build Session Note: Unit Game Offer Reporting Requirements

Date: 2026-08-31

## What Changed

- Added `reportingRequirement` to the unit game offer map type.
- Added reporting requirements to every sample publisher offer.
- Let the MiniStar offer map inherit the same reporting rules through the shared map builder.
- Displayed reporting requirements in `UnitGameOfferMapPanel`.
- Added verifier checks for reporting requirements, support-language report-only status, and speech-mode audio/transcript storage blockers.

## Why It Matters

This keeps game design tied to teacher-visible evidence from the start. A game is not merely "available"; it must explain what it reports and what it refuses to count.

## Blocked Actions

- No live event storage.
- No report export.
- No raw microphone upload.
- No transcript storage.
- No support-language-only mastery.

## Verification

- Run `npm run verify:package-readiness`.
- Run `npm run verify:routes`.
- Run `npm run verify:review-keys`.
