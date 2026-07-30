# DR-285: AI Mode Recommendation From Compatibility Matrix

Status: Accepted  
Date: 2026-07-31

Decision: Source AI generator mode recommendations from the reviewed activity compatibility matrix.

White-label impact: Strongly positive. Each tenant can offer curated, reviewed pathways without copying a public-template marketplace model or promising every conversion for every payload.

Cost impact: Positive. Reusing compatibility data avoids a separate recommendation engine and reduces future QA burden.

Constraints:

- The generator may recommend a tight pathway, not a broad switch-to-anything panel.
- Blocked conversions must stay visible with payload-fit and compatibility-rule reasons.
- Future live recommendations must produce an `activity_compatibility_snapshot`.
- This decision is recorded in `docs/adr/0285-ai-mode-recommendation-from-compatibility-matrix.md`.
