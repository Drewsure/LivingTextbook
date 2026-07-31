# DR-311: AI Generated Package Release Candidate Preview

Date: 2026-07-31

## Decision

Expose a review-only AI generated package release candidate preview on teacher generator routes.

## Rationale

The AI generator needs a visible bridge between generated package evidence and future private tenant library/release-control workflows. Showing the candidate handoff now helps partners understand the white-label product path while keeping live library publishing and student release blocked.

## Hard Boundaries

- No generated package library publish.
- No release candidate write.
- No tenant library item write.
- No student-facing release.
- No generated assignment from release candidate.
- No generated local bundle release.
- No Japanese support-language release for MiniStar.

## Required Source Records

- `ai_generated_package_manifest`
- `ai_generated_package_promotion_checklist`
- `ai_generated_publish_readiness_gate`
- `package_release_candidate`
- `tenant_library_item`
- `package_publish_gate`
- `package_approval_ledger`
- `teacher_assignment_rollout_gate`

## White-Label Impact

This keeps the AI generator saleable without making it reckless. Future tenants can see how generated content would flow into their private library, while each tenant still controls target language, assist language, media rights, teacher approval, release policy, and local bundle decisions.
