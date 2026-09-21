# ADR 0898: App Shell Hydration Boundary

## Status

Accepted

## Decision

Shared tenant navigation must render without route-dependent active styling on
the server and first client render. After hydration, it may derive the
most-specific active route from `usePathname`.

## Consequences

- Server and client markup remain stable when a deployment layer, rewrite, or
  browser navigation reports a different pathname during hydration.
- The active route appears immediately after hydration and remains centralized
  in the shared navigation component.
- The hydration guard owns presentation timing only; it cannot authorize
  routes or mutate scoring, persistence, rewards, or progression.

## Verification

Run `npm run verify:shared-app-shell-navigation`, web typecheck, production
build, and the full foundation gate.
