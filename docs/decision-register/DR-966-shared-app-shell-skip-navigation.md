# DR-966: Shared App Shell Skip Navigation

## Decision

Use one tenant-themed skip link and one focusable `main-content` target in the
shared `AppShell` so keyboard users can reach route content immediately.

## Required Invariants

- The link is present before repeated header navigation.
- The target is programmatically focusable with `tabIndex={-1}`.
- Focus styling remains visible against each tenant's configured primary color.
- Skip navigation does not own route transitions, scoring, persistence,
  rewards, or progression.

## Evidence

- `apps/web/src/components/layout/AppShell.tsx`
- `scripts/verify-shared-app-shell-accessibility.mjs`
