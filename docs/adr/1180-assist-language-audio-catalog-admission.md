# ADR 1180: Assist-Language Audio Catalog Admission Evidence

## Status

Accepted for foundation review-only implementation.

## Context

The assist-language audio evidence packet now shows whether each reviewed gloss
has an audio cue and media asset. That is necessary but not sufficient for a
white-label publisher handoff. A bound asset also needs source lineage,
checksum, transcript/spoken-text evidence, rights, accessibility fallback, and
delivery references that work for either hosted or closed/local deployment.

## Decision

Add a shared `AssistLanguageAudioCatalogRecord` contract and a tenant media
library preview. Catalog admission is only evidence-ready when all required
metadata and policy lanes are reviewed. The current sample deliberately remains
blocked because support-language cue and audio assets are not yet bound.

The contract is provider-neutral and preserves both hosted and local delivery
references without selecting a storage provider. It is review-only with no side
effects. It cannot upload, write storage, approve rights, promote a catalog
item, activate a local bundle, expose student audio, bill speech services, or
trigger progression.

## Consequences

- Publisher and school reviewers receive a concrete admission checklist.
- Missing evidence is visible per gloss instead of hidden in a package-level
  count.
- The same evidence can later support hosted and closed/local deployments.
- Durable catalog records, actual recorded files, and approval actions remain a
  future governed slice.
