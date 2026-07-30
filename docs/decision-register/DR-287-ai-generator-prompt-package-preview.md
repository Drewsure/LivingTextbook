# DR-287: AI Generator Prompt Package Preview

Status: Accepted  
Date: 2026-07-31

Decision: Add a versioned AI prompt package preview to `/teacher/generator/sample-publisher`.

White-label impact: Strongly positive. Prompt behavior becomes tenant-configurable and versioned rather than MiniStar-specific or ad hoc.

Cost impact: Strongly positive. Usage budgets, model choice, voice generation, prompt logging, and tenant billing stay blocked until a paid AI package is approved.

Constraints:

- Prompt packages must lock input slots, schema rules, tenant rules, audio requirements, model-use state, and cost controls.
- No raw student data may enter a generation prompt.
- Students cannot edit generator prompts or see premium upsell copy.
- This decision is recorded in `docs/adr/0287-ai-generator-prompt-package-preview.md`.
