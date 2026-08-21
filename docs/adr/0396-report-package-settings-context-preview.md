# ADR 0396: Report Package Settings Context Preview

## Context

Progress event envelopes now carry settings context. Teacher report package previews need to show the same context because report review is where schools and publishers will inspect evidence, exclusions, and policy blockers before export is ever allowed.

## Decision

The report package preview route displays a report-only settings context section and per-row settings profile references.

## Consequences

Teacher report previews can explain which reviewed settings profiles were active during sample events. This does not enable export, live report storage, settings save, scoring profile override, support-language progress, media-only progress, or real learner data collection.

## Verification

Active route verification now requires settings context markers on both sample report package routes.
