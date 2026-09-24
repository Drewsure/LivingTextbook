# ADR 1181: Assist-Language Audio Catalog Approval Boundary

## Status

Accepted for foundation review-only implementation.

## Context

Catalog admission evidence now enumerates checksum, transcript, rights,
accessibility, lineage, and delivery gaps per support-language gloss. A future
teacher or publisher audio owner needs a bounded decision packet before any
support recording can be admitted to a tenant catalog.

## Decision

Add a tenant-scoped `assist_language_audio_catalog_admission` approval packet.
It records the future reviewer role, required evidence, unresolved evidence,
next records, and an explicit `not-recorded` decision. The packet is provider-
neutral and compatible with hosted and closed/local deployment plans.

The packet cannot capture approval, select a provider, write storage, admit a
catalog item, promote hosted media, activate a local bundle, expose student
audio, bill speech services, or trigger progression.

## Consequences

- Human reviewers have a precise checklist before catalog admission.
- Approval intent cannot be confused with a production approval record.
- Hosted and local implementations can later preserve the same record shape.
- Actual durable approval capture remains a later governed release-control step.
