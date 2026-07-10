# DR-123: Teacher Report Package Storage Contract

## Decision

Promote teacher report package boundaries into the durable record, adapter, schema, migration candidate, and migration spec planning layers.

## Reason

The teacher report package boundary is now visible on session monitor pages. It also needs a vendor-neutral persistence contract so hosted and local implementations preserve the same learning evidence, support-only, excluded-field, and export-blocker rules.

## Standard

- `teacher-report-package` is a first-class persistence category.
- Hosted and local adapter plans include teacher report package write intents.
- Backend schema drafts include a `teacher_report_package` entity.
- Migration candidates and specs define primary keys, tenant scope, indexes, retention, export, local fallback, and policy blockers.
- Report packages may contain student progress summaries, but must reject raw learner audio and transcripts.
- Support-only signals remain reportable only and must not become mastery, Star Dust, or unlock evidence.
