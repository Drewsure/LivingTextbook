# ADR 0896: App Shell Current Route

## Status

Accepted

## Decision

The shared tenant navigation must calculate one most-specific matching route
and expose it with `aria-current="page"`. Active-route styling remains derived
from tenant CSS variables and does not change routing or authorization.

## Consequences

- Keyboard and assistive-technology users can identify the current section.
- Nested teacher and tenant routes do not produce several competing current
  items; the longest matching route wins.
- Route links remain normal same-origin links and preserve the existing QR and
  private-assignment boundaries.

## Verification

Run `npm run verify:app-shell-navigation`, web typecheck, and the production
build.
