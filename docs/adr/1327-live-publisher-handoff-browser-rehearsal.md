# ADR 1327: Live Publisher Handoff Browser Rehearsal

Date: 2026-09-30  
Status: Accepted

## Decision

The publisher-intake rehearsal must observe the actual browser route for a
tenant-bound quarantine handoff, not only its API responses. The rehearsal
loads the handoff after intake and again after the review-only evidence and
adapter records advance. It verifies the opaque quarantine identity and the
server-rendered disclosure that the route is review-only and does not prove
assembly or release.

The detailed live review journey is client-hydrated from authorized metadata,
so raw HTML checks must not pretend to prove its hydrated gate list. The
journey contract and API assertions remain the authority for gate state; the
browser-route assertions protect reachability, identity continuity, and the
safe boundary visible before hydration.

## Consequences

- A real publisher handoff has a tested browser entry point, not just a model
  and API contract.
- The rehearsal catches route, tenant, and identity regressions before any
  package-writer or QR release work is considered.
- The test deliberately does not authorize or simulate student use.

## Verification

`npm run verify:publisher-intake-rehearsal` loads the live handoff route at
both the initial and advanced review states. The full foundation gate includes
this rehearsal.
