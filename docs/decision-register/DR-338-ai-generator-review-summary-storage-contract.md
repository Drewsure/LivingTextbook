# DR-338: AI Generator Review Summary Storage Contract

## Decision
Promote `ai_generator_review_summary` / `ai-generator-review-summary` into the backend-neutral storage contract.

## Rationale
The generator route now has a tenant-aware review summary. Persisting its shape prevents hosted and local builds from treating the visible rollup as an informal UI-only state.

## Scope
- Add backend schema entity.
- Add migration candidate and migration spec.
- Add durable record and persistence boundary.
- Add hosted and local adapter write intents.
- Update backend, generator, and active-route verifiers.

## Boundaries
- No live generation from summary records.
- No app patch generation from summary records.
- No package assembly.
- No route or playlist write.
- No local bundle write.
- No student assignment.
- No student-ready marker.
