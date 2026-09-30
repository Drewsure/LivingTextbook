# ADR 1346: Promote Reviewed Publisher Assets Into Approved Custody

## Status

Accepted for the controlled pilot foundation. The write gate remains disabled by default.

## Context

Publisher PDFs, images, audio, and video enter tenant-scoped quarantine. Review and package-evidence records deliberately remain side-effect-free, but a saleable closed-local or hybrid pilot eventually needs a server-side bridge from approved quarantine bytes to the approved asset root used by package assembly.

## Decision

Add a separate approved-asset promotion writer and delivery API route. Promotion requires:

- the exact tenant, package, version, manifest, receipt, review packet, and quarantine identities;
- the existing accepted release lineage and durable delivery custody;
- reviewed package evidence containing every requested evidence reference;
- exact MIME, channel, unit mapping, file size metadata, and lowercase SHA-256 agreement with the quarantined intake record and payload bytes;
- safe relative destination paths under the tenant/package/version approved root;
- the explicit `LIVING_TEXTBOOOK_APPROVED_ASSET_PROMOTION_WRITES_ENABLED=true` gate.

The writer copies publisher bytes only after those checks, writes an immutable promotion record, supports exact replay idempotence, and reports no learner records, route mutation, hosted activation, or student-facing use. The promotion record is evidence of approved custody, not a release authorization.

## Consequences

The publisher asset journey now has a concrete, testable custody boundary. The platform can later feed approved package assets into local assembly without allowing browser code or review-only evidence to promote files. A human operator still controls enabling the gate and remains responsible for rights, release, QR, and package decisions. Package-assembly lookup of the package-scoped promoted root remains a separate integration slice.

