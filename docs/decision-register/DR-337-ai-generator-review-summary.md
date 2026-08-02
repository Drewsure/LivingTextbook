# DR-337: AI Generator Review Summary

## Decision
Add a tenant-aware AI generator review summary above the detailed generator panels.

## Rationale
The generator route is becoming a serious review console. A compact readiness rollup prevents missed blockers, supports white-label tenants, and keeps Codex, teachers, and outside AI prototype builders aligned before any app integration is considered.

## Scope
- Add `sampleAiGeneratorReviewSummaries`.
- Add `AiGeneratorReviewSummaryPanel`.
- Render it on `/teacher/generator/[tenantId]`.
- Verify the route shows section readiness, blockers, next records, source records, and blocked actions.

## Boundaries
- No live generation.
- No app file writes from generated proposals.
- No generated route or playlist write.
- No package promotion.
- No student assignment.
- No Japanese support-language trigger for MiniStar English units.
