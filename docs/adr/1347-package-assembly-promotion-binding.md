# ADR 1347: Bind Local Package Assembly To Promoted Asset Custody

## Status

Accepted for the controlled pilot.

## Decision

Local package assembly now checks for the exact tenant/package/version promotion directory beneath `LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT`. When that directory exists, a valid `promotion-record.json` is mandatory and must bind the manifest id, receipt id, tenant, package, and version. The assembler reads the package-scoped directory for content, audio, video, image, poster, and transcript files, then records `package-scoped-promotion` in the immutable assembly record.

If no package-scoped directory exists, the existing flat approved-root fixture path remains available as a compatibility fallback for controlled rehearsals. It is recorded as `legacy-flat-root` and is not a substitute for the reviewed promotion route in a production publisher deployment.

The promotion record remains custody evidence only. Assembly still requires the independent release, QR, review packet, policy, and bundle gates, and still does not activate students, hosted persistence, or learner records.

## Consequences

The publisher pilot now has a complete approved-byte path from quarantine promotion into local package assembly, while the legacy rehearsal lane remains usable during migration. Tampering or identity drift in package-scoped promotion custody blocks assembly before any package write occurs.

