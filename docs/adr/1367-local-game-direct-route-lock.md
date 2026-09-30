# ADR 1367: Lock Direct Local Game URLs Behind The Front-Door Handoff

- Status: accepted
- Date: 2026-10-01

## Context

Local package routes are printed into closed textbook deployments and must
support teacher review without allowing a direct game URL to manufacture
student progress. The local Memory Match route previously called
`completeEntryPractice` during server rendering and did not pass `packageId`
to the canonical game wrapper.

## Decision

The route now constructs only the initial progression. The canonical client
wrapper receives the package identity and accepts progress only from the
validated session-route handoff written by the front door.

## Rejected alternatives

- Completing entry practice on the server: bypasses the target-language gate.
- Putting unlock state in the QR URL: makes a printed link a bearer of learner
  progress and is unsafe for shared classroom materials.
- Creating a second local game-specific unlock system: duplicates the shared
  progression contract.

## Verification

`verify-local-pilot-memory-route.mjs` asserts that the route has the initial
progression, package identity, canonical wrapper, and no self-unlock call.
