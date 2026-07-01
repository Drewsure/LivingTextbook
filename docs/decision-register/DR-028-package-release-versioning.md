# DR-028: Package Release Versioning

Status: Accepted  
Date: 2026-07-01

## Decision

Living Textbook needs a package release/versioning scaffold before production persistence is selected. Stable front-door routes and printed QR targets must be able to point to approved active package releases while yearly content, media, and game updates create new reviewed versions behind the same entry point.

## White-Label Impact

Strongly positive. Publishers and schools can maintain their own textbook companion packages over time without requiring a new bespoke app for every edition.

## Cost Impact

Positive. A simple release record is cheaper than repairing broken QR codes, duplicated tenant screens, or unmanaged media updates after pilot commitments.

## Constraints

- Stable route paths must remain separate from raw package files.
- Package releases must show edition, version, release status, QR activation, unit count, media count, and game-mode count.
- Release changes and release gates must be visible before activation.
- Media file handoff, media rights, route persistence, and teacher approval must remain explicit gates.
- No release becomes production-active from raw PDF/DOCX intake alone.

## Verification

Use `docs/verification/CONTENT_INTAKE_CHECKS.md` and verify `http://127.0.0.1:3000/teacher/intake` shows package releases and route stability clearly.

## Related Files

- `apps/web/src/data/sampleContentIntakePlan.ts`
- `apps/web/src/features/content-intake/ContentIntakeReviewPanel.tsx`
- `docs/PACKAGE_RELEASE_VERSIONING_CONTRACT.md`
- `docs/adr/0027-package-release-versioning.md`
