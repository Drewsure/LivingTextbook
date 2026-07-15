# ADR 0234: Upload Target Mapping Storage Enforcement

## Status

Accepted.

## Context

The upload target mapping preview makes `target_mapping_packet` visible, but future hosted and local implementations also need the packet preserved in durable records and adapter write intents. Otherwise an uploaded PDF, image, audio/music file, video, or local folder could be promoted through an ambiguous target field.

## Decision

Require upload review and upload promotion records to preserve `target_mapping_packet` in shared content-model contracts, hosted adapter plans, local adapter plans, backend schema checks, and migration spec verification.

## Consequences

- Upload review and promotion cannot pass storage verification without `target_mapping_packet`.
- Hosted and closed/local white-label deployments share the same upload target boundary.
- Live upload controls remain blocked from creating draft packages, game assets, playlists, local bundle entries, routes, or assignments without a reviewed target mapping packet.
