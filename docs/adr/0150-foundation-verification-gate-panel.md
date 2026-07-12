# ADR 0150: Foundation Verification Gate Panel

## Status

Accepted

## Context

The foundation verification command now covers taxonomy, game mode coverage, package readiness, local bundle readiness, web typecheck/build, and active routes. Those checks are useful to engineers, but pilot and partner review also needs a plain-language view of what the gate protects.

## Decision

Add a `FoundationVerificationGatePanel` to `/teacher/intake` and include required text checks in the active route verifier.

## Consequences

- Teacher/admin review shows the canonical `npm run verify:foundation` command.
- The panel explains what each verifier protects in product language.
- The route verifier fails if the teacher intake page stops showing the package-readiness and local-bundle gates.
- Verification status remains a scaffold/sample status until real CI or release records exist.
