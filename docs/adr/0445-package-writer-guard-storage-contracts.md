# ADR 0445: Package Writer Guard Storage Contracts

Status: Accepted

Date: 2026-08-28

## Context

The route/playlist write guard and local companion package guard need durable backing before generated package writer work can move beyond review. The written generator contract already identified route/playlist guard storage, but backend schema, migration, and durable-record drafts did not yet carry the corresponding records.

## Decision

Add backend-neutral storage contracts for:

- `ai_generated_package_writer_route_playlist_write_guard`
- `ai_generated_package_writer_local_companion_package_guard`

These records are review evidence only. They preserve protected surfaces or artifacts, safety checks, blocked actions, next required records, support-language boundaries, media-rights checks, QR and route policy, school-policy requirements, rollback needs, and student-data exclusion.

## Consequences

- Hosted and local deployments can use the same guard record shapes.
- Future storage vendors remain replaceable because no Supabase, Firebase, SQLite, or custom local-store implementation is chosen here.
- Route writes, playlist writes, production QR redirects, local bundle packaging, media copy, assignment activation, student-ready markers, and support-language-only approval remain blocked.
- MiniStar keeps English as the target-language trigger and Japanese support hiragana-only/support-only in the lower levels.
