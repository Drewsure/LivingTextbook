# ADR 0894: Shared App Shell Skip Navigation

## Status

Accepted

## Decision

The shared `AppShell` must provide a keyboard-visible skip link to the
tenant-themed main content target. The target must be programmatically
focusable without changing route, scoring, persistence, or progression state.

## Consequences

- Keyboard users can bypass the repeated tenant header and navigation.
- The behavior is inherited by learner, teacher, review, and preview routes.
- The skip link uses tenant CSS variables so white-label themes remain intact.
- No route-specific accessibility workaround or second navigation path is
  introduced.

## Verification

Run `npm run verify:app-shell-accessibility`, web typecheck, and the
production build.
