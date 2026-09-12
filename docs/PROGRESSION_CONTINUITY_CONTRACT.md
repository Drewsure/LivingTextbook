# Progression Continuity Contract

## Purpose

This contract defines how a learner's earned progression may be carried from
the entry-practice route to a curated game route without placing progression in
a QR URL, trusting an unverified client payload, or enabling an unselected
storage provider.

The shared implementation lives in
`packages/content-model/src/progressionRuntime.ts` as:

- `ProgressionContinuityEnvelope`
- `ProgressionContinuitySnapshot`
- `validateProgressionContinuityEnvelope`
- `validateProgressionContinuityRuntimeRequest`
- `createReviewOnlyProgressionContinuityAdapter`

## Envelope Rules

Every continuity envelope must preserve:

- tenant, package, launch, learner-session, and unit identity;
- source and destination app-relative routes;
- an ISO issue timestamp and non-negative event cursor;
- the entry mode, current step, unlocked modes, completed modes, Star Dust,
  mastery status, and optional last-event timestamp;
- unique supported game modes, with completed modes contained in unlocked modes;
- an entry mode that is already unlocked; and
- explicit false values for raw learner audio, learner transcripts,
  support-language evidence, and media-only evidence.

The runtime request repeats the expected tenant, package, launch, and learner
session identity. Any mismatch is a hard validation error. A valid envelope is
therefore evidence of a safe shape, not proof that it may be trusted as live
learner state.

## Runtime Boundary

The current continuity adapter is `review-only`:

- it never writes a snapshot;
- it never mutates mastery, Star Dust, rewards, unlocks, or reports;
- it never accepts support-language or media-only evidence as progress;
- it never stores raw learner audio or transcripts; and
- it never permits cross-tenant reuse.

The envelope is transport- and provider-neutral. A future hosted, local, or
hybrid adapter may be considered only after the backend choice, learner
identity model, school/tenant policy, persistence, reporting, retention,
recovery, and release gates are approved together.

## Verification

Run:

```text
npm run verify:progression-runtime
npm run verify:runtime-behavior
```

The runtime behavior harness proves valid continuity, cross-tenant rejection,
support-language rejection, completed-without-unlock rejection, and the
no-side-effect review boundary.
