# DR-521: Assignment Rollout Generated Handoff Evidence Link

Status: Accepted

Decision: Connect generated-package assignment handoff evidence packets into the existing teacher assignment rollout preview as review-only source evidence.

White-label impact: Positive. The same tenant rollout gate handles generated and non-generated packages, reducing product complexity for schools and publishers.

Cost impact: Positive. Reusing the assignment rollout foundation avoids a duplicate AI-assignment workflow and keeps future implementation lower risk.

Constraints:

- Handoff evidence cannot schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, store raw learner audio/transcripts, or approve support-language-only handoff.
- Rollout plans must show source evidence packet ids and generated-package policy notes before generated assignment rollout work is designed.
- MiniStar generated handoff evidence remains English-triggered, hiragana-support-only, and review-only.

ADR: `docs/adr/0450-assignment-rollout-generated-handoff-evidence-link.md`
