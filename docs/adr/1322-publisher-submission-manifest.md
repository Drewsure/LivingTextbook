# ADR 1322: Publisher Submission Manifest

Date: 2026-09-30  
Status: Accepted

## Decision

Every publisher pilot begins with a tenant/package-scoped submission manifest
for the unit source and its multimedia companions. The manifest describes the
textbook source, images, learning audio/music, video/posters,
transcripts/captions, fonts, and optional background media, including accepted
file types, rights evidence, accessibility evidence, and the next review gate.

The manifest is a review-only preparation contract. It does not receive files,
promote assets, create routes, print QR codes, or authorize student-facing use.
The quarantine intake record remains the first storage boundary after the
publisher supplies a file.

## White-label rules

- Tenant identity, package identity, target language, and support languages are
  inputs, not MiniStar assumptions.
- A missing tenant language profile safely defaults to English with no support
  languages until an operator configures the tenant.
- Support languages remain assistive and cannot trigger progression.
- Rights and accessibility evidence remain required even for optional assets.
- Background media remains subject to learning-audio priority and cannot award
  mastery.

## Verification

`npm run verify:publisher-submission-manifest` validates the shared manifest,
promotion-blocked flags, required source presence, duplicate identity
rejection, and read-only route/panel boundaries. The upload route is covered by
the active 96-route preview and the full foundation gate.
