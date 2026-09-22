# Phaser Candidate Evidence Return Standard

Status: Active foundation standard

## Purpose

This standard defines how frozen Z.ai or Phaser candidate work may be returned
for review without becoming active Living Textbook code. It applies to every
external game candidate, including Memory Match and Balloon Pop.

## Required Sequence

1. A human sends the repository-scoped evidence request from the approved
   handoff packet.
2. The returned package identifies its manifest, tenant, request, queue item,
   immutable source snapshot, and source commit.
3. The evidence return packet records one receipt for every canonical lane:
   provenance, wrapper, payload, events, audio, scoring, privacy, persistence,
   replay, accessibility, and integration decision.
4. Codex verifies artifact names, checksums, lane receipts, source identity,
   canonical route alignment, and blocked-action flags.
5. Only after that review may Codex write a separate integration proposal. A
   proposal is not an integration authorization.

## Awaiting-Return State

The platform may display an `awaiting-return` packet with every receipt marked
`missing`. This is an honest readiness preview. It must not claim that files
were received, reviewed, or tested.

## Received Review-Only State

A `received-review-only` packet requires every canonical lane to be marked
`reviewed` and to cite at least one returned artifact. Every cited artifact
must exist in the returned manifest and carry a checksum. It must remain tied
to the exact manifest and eligibility record. Missing, duplicated, unknown, or
unverified lanes fail closed.

## Permanent Boundaries

- No direct archive or source import into `apps/web` or `apps/ai-service`.
- No canonical route replacement.
- No scene-owned scoring, Star Dust, rewards, persistence, or progression.
- No audio manifest, playlist, package, QR, release, or assignment mutation.
- No student-facing activation before a separate Codex integration decision.
- No use of `latest`, `main`, mutable branches, unsafe paths, or unbound
  source snapshots as evidence identity.

## Cost And White-Label Relevance

This receipt layer is provider-neutral. It keeps Z.ai useful for isolated
prototype work while protecting the saleable platform from vendor-specific
state ownership. The same contract can later accept another approved builder
without changing tenant routes, scoring, persistence, or learner records.

## Verification

- `node scripts/verify-phaser-candidate-evidence-return.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
