# ADR 1320: Read-Only Pilot Deployment Configuration Preflight

## Status

Accepted and implemented on 2026-09-30.

## Decision

Add a server-side, read-only configuration preflight to the deployment
workbench. It evaluates the named tenant against the upload and delivery
allowlists, checks required custody directories, checks local runtime read
lanes, validates the QR print base URL, and reports the optional hosted
persistence choice.

The preflight reports configuration shape only. It never returns credential
values, enables a write gate, assembles a package, mutates a QR route,
activates persistence, or starts student use.

The preflight covers three explicit paths:

- hosted PWA,
- closed local companion,
- hybrid hosted plus local.

## Rationale

The deployment workbench already described these decisions, but an operator
could not distinguish a documented requirement from a server that was actually
configured for the selected tenant. A white-label pilot needs an actionable
handoff without turning an administrative preview into an activation API.

## Security and Cost Boundaries

- Secret values remain server-side and are represented only by configured-name
  counts.
- Tenant allowlists are exact; wildcards are not accepted.
- Filesystem paths are checked for existence and directory shape but are not
  returned to the browser.
- Write and student activation flags remain false in every snapshot.
- Process-memory persistence remains an optional non-durable rehearsal path;
  durable hosted persistence still requires its separate policy and release
  gates.

## Verification

- `npm run verify:pilot-deployment-configuration`
- `npm run verify:deployment`
- full `npm run verify:foundation`

