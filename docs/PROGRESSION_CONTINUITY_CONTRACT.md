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
- `createProgressionContinuityEnvelope`
- `validateProgressionContinuityEnvelope`
- `validateProgressionContinuityRuntimeRequest`
- `createReviewOnlyProgressionContinuityAdapter`

## Envelope Rules

Every continuity envelope must preserve:

- tenant, package, launch, learner-session, and unit identity;
- tenant identity inside both the envelope and continuity snapshot;
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

The student launch pathway creates this envelope only at the reviewed handoff
from flashcard entry practice to a curated next game. It is validated before
the game mounts and again before launch-path completion is accepted. The
envelope is transient review evidence; it is not placed in the URL or browser
storage.

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

## Persistence Boundary

The provider-neutral persistence map names a separate
`progression-continuity` record. It is deliberately not folded into the
append-only progress event stream: the event stream records accepted learning
evidence, while the continuity record describes a validated route handoff
between curated activities.

The record must preserve the envelope, tenant-bound continuity snapshot, and route handoff
cursor. It must remain tenant- and package-scoped, reject stale or reordered
handoffs, and exclude raw audio, transcripts, URL state, client-authoritative
unlocks, Star Dust writes, and collection writes. Hosted and local adapters may
map the same shape, but both remain policy-gated until a backend and school or
tenant policy are accepted.

The schema, migration candidate, migration specification, durable record plan,
and adapter intents must all remain aligned before implementation work begins.

The unit capacity is owned by the shared content-model economy policy
(`UNIT_STAR_DUST_CAP`), not by an individual game or tenant adapter. All
scoring, continuity, report, and AI gamification layers must consume that
policy value.

Runtime callers are treated as untrusted even when they are typed internally.
Malformed expected identity fields must return validation errors rather than
throwing, and no adapter may turn malformed input into a route, scoring,
unlock, reward, or persistence side effect.

## Verification

Run:

```text
npm run verify:progression-runtime
npm run verify:runtime-behavior
```

The runtime behavior harness proves valid continuity, cross-tenant rejection,
support-language rejection, completed-without-unlock rejection, and the
no-side-effect review boundary.
