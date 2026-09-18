# Package Readiness Backend Mapping Checks

## Purpose

This checklist verifies that the package-readiness persistence intent has a
provider-neutral backend shape before any hosted database or local classroom
store can be enabled.

## Required Mapping

- Schema entity: `package_readiness_reconciliation`
- Migration candidate: `m106-package-readiness-reconciliation-records`
- Migration specification: `spec-package-readiness-reconciliation`
- Store kind: `release-record`
- Scope: tenant, package, release candidate, and reconciliation revision
- Evidence lanes: source assembly, approval, verifier, target-language audio,
  media rights, publish gate, and assignment rollout

## Safety Checks

- Provider remains `null` in the foundation preview.
- `write_allowed` remains `false`.
- `promotion_allowed` remains `false`.
- `student_facing_activation_allowed` remains `false`.
- Route, playlist, assignment, local-bundle, and student-data writes remain
  blocked.
- Raw learner audio, transcripts, provider credentials, and student data are
  excluded from the record.
- Hosted and closed/local deployments preserve the same metadata shape.

## Verification Commands

```text
node scripts/verify-backend-storage-readiness.mjs
npm run verify:routes
npm run verify:foundation
```

Passing this checklist proves alignment only. It does not approve a provider,
run a migration, create a storage write, promote a package, or activate a
student-facing route.
