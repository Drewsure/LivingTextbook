# ADR-0525: Recorded Audio Delivery Locators

Status: Accepted

## Context

The platform requires audio support for learner-facing text, but not every cue is a file. Text-to-speech and reviewed fallback voices can remain provider-neutral, while recorded, teacher-recorded, and partner-provided cues need a concrete delivery path. Without a locator, a package can claim recorded audio coverage while a game has nothing playable.

## Decision

Recorded, teacher-recorded, and partner-provided audio cues must include a media asset ID, hosted source URI, or local bundle path. Media asset IDs continue through the shared package binding checks. Text-to-speech and fallback voice cues are exempt from the file locator requirement.

## Consequences

Audio readiness becomes honest without selecting a voice or storage provider. Upload, storage, provider billing, release, and student-facing use remain behind their existing gates.

