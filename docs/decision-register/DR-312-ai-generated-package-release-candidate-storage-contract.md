# DR-312: AI Generated Package Release Candidate Storage Contract

Date: 2026-07-31

## Decision

Preserve AI generated package release candidate records in the backend schema, migration specs, durable record plan, persistence boundaries, and hosted/local adapter plans before generated package private-library handoff exists.

## Rationale

The release candidate preview is the future bridge from generated package evidence into private tenant libraries and release control. It must remain durable evidence, not a shortcut into a live library item, release candidate, student route, assignment, or local bundle.

## Hard Boundaries

- No generated package library publish.
- No release candidate write.
- No tenant library item write.
- No student-facing release.
- No generated assignment from release candidate.
- No generated local bundle release.
- No student-ready marker.
- No support-language-only release.

## Required Stored References

- `ai_generated_package_manifest_id`
- `ai_generated_package_promotion_checklist_id`
- `ai_generated_publish_readiness_gate_id`
- `private_library_target`
- `future_tenant_library_item_id`
- `future_package_release_candidate_id`
- `package_publish_gate`
- `package_approval_ledger`
- `teacher_assignment_rollout_gate`

## White-Label Impact

This lets MiniStar and future publisher tenants share the same generated-package handoff model while preserving tenant-specific target language, assist language, private library, release-control, media rights, approval, and local bundle rules.
