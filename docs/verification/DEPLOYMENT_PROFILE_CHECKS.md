# Deployment Profile Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

Verify that the white-label platform keeps hosted, local classroom, and packaged local deployment paths visible from the beginning of the build. The hosted PWA path is the recommended first partner pilot because it is fastest to test, but local/closed deployment remains a first-class product requirement.

## Routes

Verify at:

- `http://127.0.0.1:3000/teacher/intake`

## Required Checks

1. Confirm the teacher/admin intake page renders a `Deployment profiles` section.
2. Confirm three profiles are visible:
   - Hosted PWA pilot
   - Local classroom server
   - Packaged local app
3. Confirm the hosted PWA profile is marked as the pilot pick.
4. Confirm the local classroom and packaged app profiles are presented as later paths, not removed or treated as out of scope.
5. Confirm each profile shows at least three requirements or decision points.
6. Confirm persistence/reporting is named as an unresolved decision before any real pilot.
7. Confirm local/offline media bundle handling is named as an unresolved decision for closed deployments.
8. Confirm printed QR/deep-link behavior is named as an unresolved decision for packaged local apps.
9. Confirm the page renders a `Local bundle manifests` section.
10. Confirm local bundle manifests show bundle id, tenant, version, content package path, offline readiness, hosted redirect need, and AI Tutor state.
11. Confirm local bundle assets show audio/video kind, local path, rights status, and checksum readiness.
12. Confirm local bundle QR fallback routes are visible and do not point directly to raw files.
13. Confirm the local bundle section states that examples are planning manifests, not offline-ready builds.
14. Confirm no route or label implies that a raw PDF, AI draft, or unreviewed package can be assigned directly to students.
15. Confirm the route contract for `/teacher/intake` includes `TenantDeploymentProfile[]` and `LocalBundleManifestSummary[]`.

## Acceptance Standard

The page should let a teacher, publisher, or internal build reviewer understand the practical deployment choices without asking whether the product is only a hosted web app. It should make the fastest pilot path clear while preserving the larger white-label product ambition.

The local bundle manifest section should make closed textbook companion packaging concrete without pretending that media files, checksums, installers, or offline reporting are already production-ready.

## Known Non-Goals For This Scaffold

- No real installer is generated yet.
- No production database persistence exists yet.
- No real offline bundle loader is active yet.
- No paid AI Tutor or speech recognition entitlement is activated here.
