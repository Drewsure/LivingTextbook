# ADR 0448: Package Writer Assignment Handoff Evidence Packet

Status: Accepted

Date: 2026-08-28

## Context

Generated packages now have route/playlist guards, local companion guards, assignment shell guards, and backend-neutral assignment shell storage contracts. The next risk is treating that shell guard as enough to activate a teacher assignment, private link, roster binding, report, or classroom launch workflow.

The platform needs a visible evidence packet between assignment shell planning and any future assignment rollout gate.

## Decision

Add a review-only `AI generated package writer assignment handoff evidence packet` after the assignment shell guard in the teacher generator route.

The packet requires assignment shell guard storage, teacher QR/front-door assignment review, target-language trigger proof, private-link policy proof, no-real-learner-data proof, teacher report privacy proof, progress event taxonomy proof, classroom launch gate review, rollback evidence, and support-language boundary proof.

## Consequences

- Generated package assignment work remains review-only.
- Assignment activation, private assignment links, class roster binding, progress streams, teacher report export, live classroom launch, raw learner audio/transcript storage, and support-language-only handoff remain blocked.
- MiniStar preserves English as the only assignment progress trigger and keeps Foundation/Bronze/Plus Japanese support hiragana-only and support-only.
- Future backend work must add storage contracts for this packet before any durable handoff workflow exists.
