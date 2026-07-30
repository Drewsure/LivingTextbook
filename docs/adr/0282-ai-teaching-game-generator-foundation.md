# ADR 0282: AI Teaching Game Generator Foundation

Status: Accepted  
Date: 2026-07-31

## Decision

Add a teacher/admin AI teaching game generator foundation that creates review-only draft package requests, verifier packets, target-language audio plans, and curated activity pathway proposals.

The route is preview-only. It does not run a live model, publish student routes, generate production game code, create playlists, assign students, or spend API budget.

## Rationale

The white-label product needs a fast teacher/publisher authoring story, but the first build must protect curriculum quality, child safety, media rights, audio coverage, and cost controls. A review-first generator gives the commercial direction without creating a fragile or expensive live AI dependency.

## Consequences

- The generator sits beside source review, upload review, teacher authoring, and verifier handoff.
- The first active route is `/teacher/generator/sample-publisher` to prove the commercial partner path.
- MiniStar and upper-level AI Tutor generator requests exist in the plan data, but remain draft-only or premium-gated.
- `npm run verify:ai-generator` guards the route, data, standards, and no-direct-publish boundaries.
