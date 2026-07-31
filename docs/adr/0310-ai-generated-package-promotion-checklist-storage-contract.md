# ADR 0310: AI Generated Package Promotion Checklist Storage Contract

Date: 2026-07-31

## Status

Accepted.

## Context

The AI teaching game generator now shows a review-only promotion checklist that connects lineage, correction, audio, verifier, manifest, reward, release, approval, and assignment rollout records before a generated package can become playable.

That checklist also needs a durable hosted/local storage contract. Without one, future work could make the checklist visible in the UI while skipping the evidence needed to safely promote generated routes, playlists, assignments, local bundles, or student-ready state.

## Decision

Add `ai_generated_package_promotion_checklist` to the backend schema, migration candidate list, migration specs, durable record categories, persistence boundaries, and hosted/local adapter plans.

The record must preserve:

- generated package promotion checklist steps
- generator lineage map reference
- draft correction queue reference
- target-language audio approval reference
- verifier packet approval reference
- generated package manifest reference
- reward readiness reference
- release-control binding
- teacher approval ledger reference
- assignment rollout gate reference

It must also block generated package promotion, route registry writes, media playlist writes, assignment writes, local bundle writes, student-ready markers, and support-language-only promotion until future live workflow gates explicitly allow them.

## Consequences

- Hosted and closed local deployments share the same generated-package promotion evidence model.
- Teacher-facing generator previews cannot drift away from storage requirements.
- MiniStar keeps English as the target-language trigger while Japanese remains support-only.
- Future live promotion work has a clear integration boundary instead of inventing ad hoc publish flags.
