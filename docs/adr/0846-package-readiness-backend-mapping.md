# ADR 0846: Package Readiness Backend Mapping

## Status

Accepted for foundation planning; implementation remains blocked by policy.

## Decision

Map the seven-lane package-readiness persistence intent into an explicit
provider-neutral backend schema entity, migration candidate, and migration
specification before selecting or enabling a hosted or local persistence
provider.

## Rationale

The persistence intent is now a shared contract used by teacher review surfaces
and adapters. Without a matching backend map, schema drift could silently
separate the hosted and closed/local product paths or omit evidence required to
make a package safe to release.

## Guardrails

- The record is tenant-scoped and release-control scoped.
- All seven evidence-lane references remain mandatory.
- Provider selection and every write or activation flag remain false.
- No migration runs and no live database, object-storage, route, playlist,
  assignment, local-bundle, or student-data write is enabled.
- Raw learner audio, transcripts, provider credentials, and student data do not
  belong in this release-control record.

## Consequences

The foundation can now verify backend shape and hosted/local parity before a
provider decision. A later implementation phase still needs authorization,
retention, export, backup, rollback, migration rehearsal, tenant-isolation,
and school-policy gates.

See `docs/verification/PACKAGE_READINESS_BACKEND_MAPPING_CHECKS.md` and
`docs/decision-register/DR-918-package-readiness-backend-mapping.md`.
