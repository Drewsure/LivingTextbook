# DR-968: App Shell Current Route

## Decision

Centralize current-route semantics in the shared tenant navigation and mark
only the most specific matching item with `aria-current="page"`.

## Required Invariants

- Root matches only `/`.
- Nested routes may match their section prefix, but the longest matching href
  is the sole current item.
- Active styling uses tenant variables and remains visible on keyboard focus.
- Navigation state does not own routing authorization, scoring, persistence,
  rewards, or progression.

## Evidence

- `apps/web/src/components/layout/AppShellNavigation.tsx`
- `apps/web/src/components/layout/AppShell.tsx`
- `scripts/verify-app-shell-navigation.mjs`
