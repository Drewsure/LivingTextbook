# DR-289: AI Generator Engine Binding Preview

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only engine binding preview to `/teacher/generator/sample-publisher`.

White-label impact: Strongly positive. Tenants can receive different activity pathways while the platform keeps one reusable engine architecture.

Cost impact: Strongly positive. Reusing parent engines and scoring profiles is far cheaper than maintaining generated one-off games.

Constraints:

- Generated activity proposals must bind to existing mode catalog entries, parent engines, scoring profiles, and standard events.
- Z.ai and outside prototypes remain isolated until integration review.
- Standalone generated game code and parent-engine bypass remain blocked.
- This decision is recorded in `docs/adr/0289-ai-generator-engine-binding-preview.md`.
