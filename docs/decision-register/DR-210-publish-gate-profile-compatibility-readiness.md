# DR-210: Publish Gate Profile Compatibility Readiness

## Decision

Make activity compatibility snapshots, template rendering profiles, and font accessibility profiles explicit release-blocking package publish gates.

## Rationale

Backend contracts and preview panels protect the foundation, but package release control must also know when those records are missing. A future publisher pilot should not ship with visible game choices, printables, or font controls unless the reviewed profile records are attached.

## Implications

- The sample publish gate now includes `activity-rendering-profile-gate`.
- `npm run verify:release-control` requires the gate.
- Pilot release remains blocked until reviewed compatibility/profile records exist.
- Switch-to-anything panels, unchecked printable conversions, and unapproved font use remain forbidden.

## Next

When real release candidates are persisted, connect this gate to actual package-level compatibility/profile record ids.

