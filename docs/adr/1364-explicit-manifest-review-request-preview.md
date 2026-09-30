# ADR 1364: Explicit Machine-Bound Manifest Review Request Preview

## Status

Accepted for the review-only pilot foundation.

## Decision

Expose a validated, read-only preview of the exact request needed to record a
reviewed local bundle manifest. Keep the actual custody write behind the
dedicated pilot delivery API token and do not grant that capability to teacher
browser authorization.

## Rationale

The saleable pilot needs an operator-friendly handoff, but the reviewed
manifest is release-grade custody. A visible request preview reduces copying
errors without turning a teacher workbench into a release writer.

## Boundary

The preview contains metadata only. It does not call the endpoint, display the
manifest body, expose credentials, copy files, assemble a package, promote
assets, print QR codes, activate hosted persistence, create learner records,
or enable student-facing use.
