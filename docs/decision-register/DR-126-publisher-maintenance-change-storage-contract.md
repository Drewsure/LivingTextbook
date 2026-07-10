# DR-126: Publisher Maintenance Change Storage Contract

## Decision

Promote publisher maintenance change requests into durable records, adapter plans, schema draft, migration candidates, and migration specs.

## Reason

The maintenance change queue makes year-on-year publisher updates visible, but future hosted and local deployments need a durable record shape before partners can self-maintain content, media, games, QR routes, and report settings.

## Standard

- `publisher-maintenance-change` is a first-class persistence category.
- Hosted and local adapter plans include publisher maintenance change write intents.
- Backend schema draft includes `publisher_maintenance_change`.
- Migration candidates and specs define keys, tenant scope, impact summaries, approvals, blockers, retention, export, and local fallback.
- Change requests cannot directly mutate active routes, media manifests, game offers, or teacher reports.
- QR alias changes require fallback, redirect, rollback, and old-edition behavior review.
