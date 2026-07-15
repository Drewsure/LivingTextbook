# 2026-07-15: Upload Target Mapping Storage Enforcement

## Summary

Added explicit storage and adapter enforcement for upload `target_mapping_packet`.

## Why

The upload workspace now shows target mapping preview rules. The backend-neutral contract also needs to preserve those mappings so future hosted or closed/local deployments cannot promote uploaded files through ambiguous target metadata.

## Changed

- Added shared content-model validation for upload target mapping packet preservation.
- Updated hosted and local upload review/promotion write intents.
- Updated durable record planning.
- Expanded backend storage verification and documentation.

## Verification

- `npm run verify:backend-storage`
