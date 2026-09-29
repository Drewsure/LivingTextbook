# ADR 1297: Fresh-Tenant Publisher Intake Rehearsal

Status: Accepted

## Context

The publisher intake rehearsal proved the quarantine, evidence, package-review,
delivery-mode, and release boundaries, but it used the populated Sample
Publisher tenant. That left the most important white-label custody claim
untested: a new publisher must begin with an empty tenant-owned workspace and
must not inherit reference records.

## Decision

Use a fresh synthetic tenant for the end-to-end publisher intake rehearsal. The
rehearsal first requests that tenant's upload route and asserts its empty-state
and reference-record isolation, then submits a synthetic source and advances it
through the existing review-only package flow.

## Boundaries

- The fresh tenant receives platform upload-channel policy, not Sample
  Publisher content or MiniStar records.
- The source remains quarantine metadata and never becomes a student-facing
  asset during the rehearsal.
- Evidence, package revision, delivery mode, promotion adapter, persistence,
  QR, release, and student-use gates remain independently enforced.
- This is a deterministic rehearsal fixture, not permission to enable live
  publisher intake or release.

## Verification

- `npm run verify:publisher-intake-rehearsal`
- The rehearsal asserts the fresh tenant route is `200`, starts empty, exposes
  the isolation disclosure, and omits Sample Publisher/MiniStar records.
- It then verifies the blocked release outcome after immutable packet revision
  two and the hosted-persistence preview remains unselected and disabled.
