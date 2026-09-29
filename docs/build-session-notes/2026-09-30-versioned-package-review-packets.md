# Build Session: Versioned Package Review Packet Revisions

## Outcome

Closed the blocked-packet dead end in the publisher pilot review flow. A packet
captured before promotion-adapter selection can now remain immutable while a
later adapter decision produces a new, linked review packet revision.

## Implemented

- Added optional revision and supersession identity to the packet contract.
- Added versioned sidecar discovery and highest-valid-revision selection.
- Preserved revision-one filename and packet identity for compatibility.
- Reissued only blocked packets missing the promotion-adapter record.
- Added structural verification and foundation composition coverage.
- Added a production-preview publisher-intake rehearsal covering revision-one
  blocking, adapter selection, revision-two supersession, highest-revision
  readback, and continued release/QR/student-use blocking.
- Updated handoff and packet validation so an evidence-ready state may have an
  empty blocker list while blocked and needs-review states still require
  actionable blockers.

## Verification

```powershell
node scripts/verify-package-review-packet-revision.mjs
npm run verify:foundation-composition
npm run verify:publisher-intake-rehearsal
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web -- --webpack
git diff --check
```

All revisions remain review-only. No package, QR, hosted, or student write is
enabled by this lifecycle change.
