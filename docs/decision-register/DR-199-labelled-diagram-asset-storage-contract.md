# DR-199: Labelled Diagram Asset Storage Contract

## Decision

Promote `game_asset_manifest` and `label_anchor_record` into the backend-neutral storage contract.

## Rationale

Image uploads are foundational for Labelled Diagram and future visual games, but they are risky if a reviewed file can become a game asset by file location or preview state alone. The platform needs durable asset and label records before live image editors or student-facing image games exist.

## Implications

- Backend schema drafts include `game_asset_manifest` and `label_anchor_record`.
- Migration candidates and specs cover hosted and local storage paths.
- Durable records and persistence adapters preserve image rights, alt text, source lineage, reviewed label anchors, label audio coverage, and release blocks.
- Support-language label text remains support-only and cannot unlock progress.
- Student-facing image games, live label editors, auto-generated active labels, and folder-placement promotion remain blocked.

## Next

Continue with preview-first slices for upload/media workflows, then add a reviewed Labelled Diagram authoring prototype only after storage, verifier, and release-control gates remain green.
