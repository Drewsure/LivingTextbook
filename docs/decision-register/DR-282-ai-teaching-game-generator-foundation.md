# DR-282: AI Teaching Game Generator Foundation

Status: Accepted  
Date: 2026-07-31

Decision: Add the AI teaching game generator as a teacher/admin foundation surface that produces draft package requests and verifier packets, not production games or student assignments.

White-label impact: Strongly positive. It gives future publishers a clear product promise: bring textbook/PDF/media content, then generate reviewed game-package drafts across curated modes while retaining tenant-specific rules and branding.

Cost impact: Positive. No live model call is made in the scaffold, and future AI generation, speech scoring, and AI Tutor features stay behind tenant/school package approval and API cost gates.

Constraints:

- Generated outputs remain Draft only until review and publish gates pass.
- Every target-language learner-facing text item needs audio.
- Support language cannot unlock progress.
- Activity pathways are curated and compatibility-checked; the platform does not promise switch-to-anything generation.
- Premium AI Tutor requests remain optional, school-approved, usage-limited, and hidden from child-facing upsell.
- This decision is recorded in `docs/adr/0282-ai-teaching-game-generator-foundation.md`.
