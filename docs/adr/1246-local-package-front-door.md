# ADR 1246: Package-Scoped Local Front Door

## Status

Accepted for the first white-label pilot vertical slice.

## Decision

The local pilot begins at a package-scoped front door that reuses the
canonical target-language flashcard flow. After the shared completion event,
the student is offered the package-scoped Memory Match route. Route
destinations are supplied through explicit overrides so the local package
cannot fall back to sample/demo URLs.

Support-language content remains optional comprehension support. It cannot
complete practice or unlock the next activity. The route remains read-only and
does not activate hosted persistence, write learner records, mutate QR aliases,
or change release state.

## Consequences

- One student journey can be rehearsed against a real assembled package.
- The canonical game, audio, scoring, and progression contracts remain shared
  with the hosted routes.
- The local route is useful before a persistence provider is selected.
- Saleable-pilot approval still requires real publisher content and evidence.

## Verification

`scripts/verify-local-pilot-front-door-route.mjs` checks the route, routing
seams, package reader, target-language entry contract, and forbidden parallel
paths. Foundation composition runs that verifier.
