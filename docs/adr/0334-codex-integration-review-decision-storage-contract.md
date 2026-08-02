# ADR 0334: Codex Integration Review Decision Storage Contract

## Status

Accepted

## Context

The teacher generator routes now show a review-only Codex integration decision preview. That preview protects the platform from treating completed prototype evidence as permission to patch `apps/web`, write routes, mutate scoring, write rewards, change audio manifests, promote packages, or assign students.

The decision also needs a backend-neutral storage contract. Without a durable hosted and closed-local record, future pilot work could lose the accountable review decision or infer approval from UI state.

## Decision

Add `codex_integration_review_decision` / `codex-integration-review-decision` across schema draft, migration candidates, migration specs, durable records, persistence adapter plans, content-model guard rules, and route verification.

The contract preserves linked integration plan, linked readiness gate, selected decision, decision status, decision-recorded state, manual Codex review requirement, all-evidence-reviewed state, reviewer identity requirement, decision options, decision evidence checks, and blocked actions.

## Consequences

- Hosted and closed-local deployments can store the same Codex decision shape.
- Returned prototypes cannot claim integration approval, app-patch generation, route readiness, scoring mutation readiness, reward readiness, package promotion, or assignment readiness from UI-only state.
- App patch generation, direct imports, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, and assignments remain blocked.
- MiniStar Japanese support remains support-only and hiragana-safe for early levels; English remains the target-language trigger.
