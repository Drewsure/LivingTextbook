# DR-024: Deployment Profile Scaffold

Date: 2026-07-01  
Status: Accepted  
Related ADR: `docs/adr/0023-deployment-profile-scaffold.md`

## Decision

The platform will expose deployment profiles as part of the teacher/admin intake foundation. The first scaffold includes hosted PWA, local classroom server, and packaged local app paths.

## Rationale

The product must be saleable as a white-label Living Textbook platform. Hosted web is the most practical first pilot route, but textbook publishers and schools may require local or closed deployments with multimedia, permanent QR codes, games, and reporting. Showing these paths early helps avoid hidden architecture drift.

## Implementation Notes

- Added `sampleDeploymentProfiles` as reviewed sample deployment data.
- Added `DeploymentProfilePanel` for the teacher/admin intake route.
- Wired deployment profiles into `http://127.0.0.1:3000/teacher/intake`.
- Updated route contracts so `/teacher/intake` requires `TenantDeploymentProfile[]`.
- Added focused verification in `docs/verification/DEPLOYMENT_PROFILE_CHECKS.md`.

## Follow-Up

- Select the real first pilot deployment profile before partner testing.
- Add database-backed route registry and reporting persistence.
- Define local bundle manifest and yearly content-package update procedure.
- Define QR/deep-link fallback behavior for packaged local deployments.
