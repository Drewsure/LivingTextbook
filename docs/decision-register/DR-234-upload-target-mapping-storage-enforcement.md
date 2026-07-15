# DR-234: Upload Target Mapping Storage Enforcement

## Decision

Preserve `target_mapping_packet` as a required storage and adapter contract for upload review and upload promotion.

## Rationale

Upload target mapping is the controlled bridge between a file and a future target record. It must survive hosted storage, local storage, backup/export, review, and promotion gates as a named packet so uploads cannot become student-facing content by route creation, folder placement, or assignment shortcut.

## Implications

- Shared content-model validators require target mapping packet preservation for upload review and upload promotion.
- Hosted and local adapter plans include `preservesUploadTargetMappingPacket`.
- Backend storage verification checks schema, migration specs, adapter plans, and durable records for packet preservation.
- Live upload controls remain blocked until reviewed target packets, target-specific records, and release-control policy exist.

## Next

When live upload implementation begins, build write flows around packet creation and review first; only then connect target-specific promotion into draft packages, game assets, media playlists, or local bundle entries.
