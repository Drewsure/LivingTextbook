# DR-303: MiniStar AI Generator Seed Records

Status: Accepted  
Date: 2026-07-31

Decision: Add first review-only MiniStar generator seed records for the Level 1 greetings request.

White-label impact: Positive. MiniStar proves the flagship tenant path while keeping tenant rules configurable and preventing sample-publisher records from leaking into MiniStar readiness.

Cost impact: Positive. AI generation, synthetic voice, speech scoring, and AI Tutor remain premium-disabled until MiniStar and school package approvals exist.

Constraints:

- English target-language events remain the only progress trigger.
- Japanese support remains support-only and hiragana-only for Foundation/Bronze/Plus.
- No live model call, generated Draft JSON, verifier submission, package assembly, route creation, playlist creation, or student assignment is enabled.
- This decision is recorded in `docs/adr/0303-ministar-ai-generator-seed-records.md`.
