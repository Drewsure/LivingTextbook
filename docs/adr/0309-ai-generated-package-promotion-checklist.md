# ADR 0309: AI Generated Package Promotion Checklist

Date: 2026-07-31

## Status

Accepted.

## Context

The AI teaching game generator now exposes draft requests, prompt packages, Draft JSON previews, correction queues, verifier packets, generated package manifests, publish readiness gates, teacher review queue items, and lineage maps. These records are accurate but distributed across multiple panels.

Teachers, partners, and future agents need one readable pathway that answers: what is still required before a generated draft can become a real playable package?

## Decision

Add a review-only `ai_generated_package_promotion_checklist` preview to teacher generator routes. The checklist must translate lineage, correction queue, target-language audio, verifier, manifest, reward readiness, release control, approval ledger, and assignment rollout requirements into a draft-to-playable package pathway.

The checklist is not an action surface. It blocks generated package promotion, route registry writes, playlist writes, assignment writes, local companion bundle writes, and student-ready markers.

MiniStar promotion checklists must preserve English as the target-language trigger and keep Japanese hiragana support as support-only.

## Consequences

- Reviewers get one concise promotion map without enabling live publishing.
- Future hosted/local storage work has a clearer checklist-shaped durable record to preserve.
- Generated content still cannot skip the same package, audio, rights, approval, release, and launch gates as teacher-authored content.
- The checklist creates more foundation UI, but it lowers future integration risk and keeps white-label packaging explainable.
