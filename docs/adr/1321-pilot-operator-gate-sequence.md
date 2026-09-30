# ADR 1321: Pilot Operator Gate Sequence

Date: 2026-09-30  
Status: Accepted

## Decision

The first saleable white-label pilot has one ordered, tenant/package-scoped
operator gate sequence. It is derived from the deployment configuration
preflight and names the remaining human gates in order: server configuration,
publisher source and rights, reviewed package, delivery and persistence,
QR/fallback review, teacher rehearsal, and human release authorization.

The sequence is a read-only planning boundary. It does not accept evidence,
record decisions, enable writes, print QR codes, activate persistence, or
start students. A configured server is never treated as proof that a package
is releasable.

## Why

The platform already has the individual workspaces and safety contracts, but a
publisher-facing pilot needs an unambiguous next action. A single ordered
sequence reduces operator drift and keeps the package identity attached while
the human moves between source, media, deployment, QR, school policy, and
release review.

## Consequences

- Deployment configuration is visible beside the exact tenant and package
  scope it is intended to serve.
- The operator can distinguish an environment blocker from a human approval
  gate without confusing either with release readiness.
- The default remains fail-closed: `writesEnabled` and
  `studentActivationAllowed` are always false in this sequence.
- The sequence does not replace the acceptance matrix, evidence records,
  school policy, or release-control decision.
- Z.ai/Phaser candidates remain outside this sequence until their complete
  evidence return package is accepted.

## Verification

`npm run verify:pilot-deployment-configuration` protects the route mount,
tenant/package/mode binding, visible safety fields, and side-effect-free
sequence contract. The full foundation gate remains the release-level check.
