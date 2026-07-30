# DR-286: AI Generator Audio Coverage Plan

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only AI generator audio coverage plan to `/teacher/generator/sample-publisher`.

White-label impact: Strongly positive. Every tenant can define approved voices, partner-owned audio, fallback TTS, support-language rules, and background media policies without changing the generator architecture.

Cost impact: Positive. The foundation blocks live synthetic voice generation and voice API costs until a tenant explicitly buys into that package.

Constraints:

- Every target-language term, sentence, instruction, feedback line, and critical control needs reviewed audio before student use.
- Support-language audio is support-only and cannot unlock progress.
- Background music or video sound cannot count toward mastery and must yield to learning audio.
- This decision is recorded in `docs/adr/0286-ai-generator-audio-coverage-plan.md`.
