# DR-295: AI Generated Draft Payload Validator

Status: Accepted  
Date: 2026-07-31

Decision: Add a shared content-model validator for AI-generated draft payloads and preview shells before generated content can move toward review or student use.

White-label impact: Strongly positive. Every tenant can use the same generator guard while still configuring curriculum, branding, support language, media policy, and premium AI package state.

Cost impact: Positive. Invalid generated drafts are blocked before they trigger verifier workflow, storage writes, media work, package assembly, route creation, playlist creation, or assignment setup.

Constraints:

- The validator must enforce 8-12 vocabulary terms and exactly 2 target sentence structures.
- The validator must preserve `target_language_progress_trigger: target-language-only`, `support_language_progress_allowed: false`, and `media_only_progress_allowed: false`.
- Target-language audio must be present and approved before student assignment.
- Preview shells must keep copy, verifier submission, publish, playlist creation, and assignment blocked.
- The teacher generator route must display schema guard blocks and warnings.
- This decision is recorded in `docs/adr/0295-ai-generated-draft-payload-validator.md`.
