# ADR 1110: Commercial Deployment Handoff

## Decision

Create one provider-neutral, tenant-bound handoff packet for the three saleable
deployment paths: hosted PWA, local classroom server, and packaged textbook
companion.

Each path is represented as a review artifact with deliverables, continuity
evidence bindings, and blockers. The packet remains review-only and keeps
export, installation, activation, and QR/route mutation disabled.

## Rationale

The deployment workbench already explains product choices and recovery
evidence, but a publisher-facing review needs a single artifact that states
what each path would deliver. A separate handoff contract prevents a
recommendation or evidence summary from being mistaken for a license,
installer, or live deployment.

## Consequences

- Hosted, local, and packaged offers can be compared using the same contract.
- Future provider-specific work must bind to the packet rather than bypass it.
- No commercial artifact can be exported or activated until policy, rights,
  retention, recovery, tenant-isolation, accessibility, and release gates are
  accepted by a later decision.
- MiniStar remains fixture data, not a platform assumption.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:routes`
- Full foundation verification before publication.
