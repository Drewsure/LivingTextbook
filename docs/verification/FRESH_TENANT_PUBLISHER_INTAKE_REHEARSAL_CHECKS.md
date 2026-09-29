# Fresh-Tenant Publisher Intake Rehearsal Checks

## Purpose

Verify that the first saleable white-label intake path is tenant-safe before
any publisher source can be promoted into a reviewed package.

## Automated checks

- A fresh synthetic tenant resolves to the generic upload workspace.
- The page starts with no admitted publisher files.
- The page discloses that Sample Publisher and MiniStar review records are not
  shown.
- Sample Publisher and MiniStar reference records are absent from the fresh
  tenant response.
- The fresh tenant source-review page returns `200`, starts with no source
  records, and exposes the authorized quarantine review contract.
- A synthetic PDF enters the explicitly enabled quarantine route with an
  opaque quarantine id and student-facing use disabled.
- Evidence review, source review, package evidence, delivery mode, promotion
  adapter, and immutable packet revision are recorded as review-only metadata.
- Assembly preflight recognizes the reviewed multimedia/game evidence while
  keeping delivery manifest, release/QR authorization, and local/hosted
  handoff blockers explicit.
- Hosted persistence remains preview-only, unselected, and write-disabled.
- QR printing, delivery release, package assembly, promotion, and student use
  remain blocked.

## Command

```powershell
npm run verify:publisher-intake-rehearsal
```

## Release interpretation

Passing this rehearsal proves the white-label custody and review boundary. It
does not approve real publisher uploads, package assembly, QR printing,
student activation, or hosted persistence.
