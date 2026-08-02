# DR-339: AI Generator Reviewer Runbook

## Decision
Add a tenant-aware AI generator reviewer runbook above the detailed generator panels.

## Rationale
The generator route is now a review console. Reviewers need a clear human order of operations so they can inspect records without confusing visibility with permission.

## Scope
- Add `sampleAiGeneratorReviewerRunbooks`.
- Add `AiGeneratorReviewerRunbookPanel`.
- Render it on `/teacher/generator/[tenantId]`.
- Verify both generator tenant routes expose the runbook and blocked shortcuts.

## Boundaries
- No live model call.
- No app patch generation.
- No package assembly.
- No route or playlist creation.
- No local bundle write.
- No student assignment.
- No Japanese support-language trigger for MiniStar English units.
