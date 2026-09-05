# DR-558: AI Generator Assist-Policy Handoff

Status: Accepted

Decision: Carry structured assist-language script policy and level-band fields through AI game-generator request previews.

Rationale:

- Free-form assist-language notes are not sufficient to protect Foundation, Bronze, and Plus hiragana-only requirements.
- Generator requests must preserve policy before draft, verifier, teacher review, and package assembly stages.
- The same shape supports white-label tenant-defined policies and later Japanese target-language work without making Japanese universal.

Guardrails:

- MiniStar Level 1 requests declare `hiragana-only` and `foundation`.
- Missing policy remains visible as `Not declared` in the review panel.
- No live model call, model billing, publish, assignment, or support-language progression is introduced.
- The generator remains review-only until the Z.ai handoff signal is explicitly changed by Codex.

Evidence:

- `apps/web/src/data/sampleAiGameGeneratorPlan.ts`
- `apps/web/src/features/content-intake/AiGameGeneratorPlanPanel.tsx`
- `scripts/verify-ai-game-generator.mjs`
- `docs/adr/0487-ai-generator-assist-policy-handoff.md`
