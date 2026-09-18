# ADR 0855: Local Bundle Media Accessibility Metadata

## Status

Accepted for foundation rehearsal.

## Context

The Living Textbook platform treats learning audio as essential and must keep
video and image experiences accessible. The local bundle manifest already has
optional poster and transcript fields, but sample tenant planning data did not
exercise them.

## Decision

Add representative transcript/caption and poster paths to the MiniStar and
partner audio/video planning entries and pass them through the read-only
resolver manifest shape.

## Boundaries

The paths are evidence only. They do not read or generate files, perform
transcription, transcode media, approve rights, cache media, activate offline
playback, or grant progression authority to media-only events.

## Consequences

Accessibility metadata is now visible at package-planning time and can be
validated before a future loader is designed. Real files, language metadata,
rights, checksums, and release approval remain required for production use.
