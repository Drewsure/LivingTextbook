# DR-970: App Shell Hydration Boundary

## Decision

Keep route-dependent active navigation state suppressed until the shared app
shell navigation has hydrated. Then select exactly one most-specific matching
route from the browser pathname.

## Required Invariants

- The first server and client render do not depend on browser-only route state.
- After hydration, only the most-specific matching route receives
  `aria-current="page"`.
- The root route remains an exact match and nested routes remain prefix-aware.
- The guard changes navigation presentation only; it does not own routing
  authorization, scoring, persistence, rewards, or progression.

## Evidence

- `apps/web/src/components/layout/AppShellNavigation.tsx`
- `scripts/verify-app-shell-navigation.mjs`
- `docs/adr/0898-app-shell-hydration-boundary.md`
