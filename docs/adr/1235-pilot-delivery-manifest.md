# ADR 1235: Pilot Delivery Manifest

## Status

Accepted for the first saleable pilot boundary.

## Decision

Use a single typed delivery manifest as the handoff between reviewed package
evidence and a future manual package writer. The manifest composes publisher
source, package readiness, multimedia rights, game audio, QR registry and
print authorization, local bundle, hosted persistence, teacher policy, and
release approval.

## Safety

Manifest creation is side-effect-free. It does not write a package, expose raw
media, mutate QR aliases, activate persistence, or enable student-facing use.
It reports `blocked` until every required gate closes and otherwise reports
`ready-for-manual-release`, which still requires a separate human release
action.

## Rationale

The acceptance matrix needs one authoritative object that can be handed to a
publisher or package writer. Separate previews are useful for review, but they
must not be mistaken for a coherent delivery decision.

## Verification

Run `node scripts/verify-pilot-delivery-manifest.mjs`, the publisher package
preview verifier, web typecheck, production build, route checks, and the
foundation composition gate.
