# ADR 0230: Upload File Policy Profiles

## Status

Accepted.

## Context

The platform will need PDF/text, image, audio, music, video, and local-bundle uploads. Live upload controls are risky without a clear file policy layer for extension, MIME type, size, duration, checksum, scan, rights, transcript/caption, alt text, and target mapping expectations.

## Decision

Add upload file policy profiles as review metadata in the teacher upload workspace. These profiles define accepted extensions, required maximums, required checks, blocked shortcuts, and the next storage gate for each upload family before any file picker or storage write exists.

## Consequences

- Future upload controls must satisfy `scan_and_file_policy_packet` before promotion.
- File policy acceptance becomes a hard prerequisite for upload promotion.
- The foundation still does not validate, scan, checksum, transcode, store, or publish real files.
- The upload workspace now separates channel readiness from file policy readiness.
