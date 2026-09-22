# ADR 0945: Evidence Handoff Canonical Scope

Status: Accepted

## Context

The teacher evidence-packet handoff was a useful preview, but it carried a
separate preview package id from the canonical pilot release package. That
allowed a reviewer to see technically valid evidence under an identity that
could not be reconciled with release, persistence, approval, or activation
records.

## Decision

Promote the evidence-packet handoff shape into the shared content model. The
handoff now carries the canonical package id, a separate stable route key, and
a validator for scope, internal routes, unique records, required missing
evidence, and blocked live actions. The route displays validator status while
export, signing, publishing, promotion, route creation, playlist creation, and
assignment remain blocked.

## Consequences

- Teacher and partner review surfaces refer to one package identity.
- The handoff is more useful as a future storage and export contract without
  creating storage or export side effects now.
- A future backend can persist the same packet without changing its identity or
  safety boundary.

## Verification

- `node scripts/verify-evidence-handoff-scope.mjs`
- `npm run verify:content-model-boundary`
- `npm run verify:routes`
