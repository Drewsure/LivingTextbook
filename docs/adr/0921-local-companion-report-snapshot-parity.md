# ADR 0921: Local Companion Report Snapshot Parity

## Status

Accepted for foundation review; local package activation remains blocked.

## Decision

Include the shared teacher report snapshot recovery rehearsal in both local
companion previews. MiniStar and sample publisher local routes resolve their
own tenant-aware report context, but use the same hosted-managed and
closed-local packet contract.

## Rationale

The saleable white-label product must not treat local deployment as a second-
class reporting design. Showing the same sanitized evidence in local package
review makes parity inspectable before a closed installer or local store is
approved. The preview remains a planning surface and does not write files,
create local storage, or activate recovery.

## Required Invariants

- Local route identity remains tenant-specific.
- The report snapshot is the same canonical shape used by hosted review.
- No local folder write, backup, restore, export, or provider activation is
  exposed.
- Raw events, learner audio, transcripts, and real learner identifiers remain
  excluded.

## Evidence

- `apps/web/src/features/deployment/LocalCompanionPackagePreviewPanel.tsx`
- `apps/web/src/app/local/ministar/page.tsx`
- `apps/web/src/app/local/sample-publisher/page.tsx`
- `scripts/verify-active-routes.mjs`

