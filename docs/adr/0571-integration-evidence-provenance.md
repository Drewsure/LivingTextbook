# ADR 0571: Integration Evidence Provenance

Status: Accepted

## Decision

Build integration-readiness evidence checks from the statuses of the existing
wrapper, fixture, event, audio, mobile, scoring, and Codex-decision records.

The mapping rules are:

- explicit `reviewed` or `passed` records become reviewed evidence;
- explicit pending-review records remain pending review;
- not-started, not-run, blocked, missing, unknown, or absent records remain
  blocked evidence;
- the readiness-gate self-check becomes reviewed only when every upstream
  evidence check is reviewed.

## Context

The integration gate already listed the required evidence, but its sample
checks were all manually set to blocked. That was safe but lossy: the gate
could not prove which underlying records had advanced, and future review could
mistake stale gate data for current evidence.

## Consequences

- The gate now preserves provenance while retaining its review-only boundary.
- Z.ai and Phaser packages can be assessed from the records they actually
  return rather than from a duplicate hand-maintained status list.
- The self-check cannot create its own readiness.
- No import, app patch, route write, scoring/reward change, playlist write,
  package promotion, or assignment is enabled.

## Verification

Web typecheck, runtime verification, production build, and active route checks
must pass. The gate validator also rejects status values that disagree with
their evidence checks.
