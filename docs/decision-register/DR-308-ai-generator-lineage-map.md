# DR-308: AI Generator Lineage Map

Status: Accepted  
Date: 2026-07-31

Decision: Add an inspection-only AI generator lineage map to teacher generator routes.

White-label impact: Positive. All tenants can trace generated packages through the same lineage stages while preserving tenant-specific support-language, media, and approval rules.

Cost impact: Positive. The map is static review evidence and creates no model call, storage write, verifier submission, package assembly, route, playlist, local bundle, or assignment.

Constraints:

- Lineage maps are review-only.
- They cannot generate, submit verifier packets, assemble packages, create routes, create playlists, assign students, write local bundles, unlock support-language progress, or mark student-ready state.
- MiniStar lineage must keep English as target-language trigger and Japanese as hiragana-only support.
- This decision is recorded in `docs/adr/0308-ai-generator-lineage-map.md`.
