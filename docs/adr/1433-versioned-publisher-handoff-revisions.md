# ADR 1433: Versioned Publisher Handoff Revisions

## Status

Accepted for the first saleable white-label pilot.

## Decision

Publisher handoffs are immutable review records. When a publisher supplies a
new file or corrects intake metadata, the operator creates a new external
handoff folder with `create-publisher-pilot-intake-revision.mjs`. The helper
copies only the intake brief, README, and paths declared by that brief. It
does not copy `publisher-source-manifest.json` or prior intake/source
preflight reports; those must be regenerated into new create-once evidence
paths.

The helper preserves missing required and omitted optional files in its output
summary, rejects repository-local roots, symlinked inputs, and non-empty output
folders, and keeps review-only safety flags unchanged. It performs no upload,
package assembly, QR printing, persistence activation, or student activation.

## Consequences

Audit history remains stable and every publisher revision has a clear custody
boundary. Operators gain a repeatable recovery path when required audio,
captions, images, video, or rights evidence arrives late. The tradeoff is an
additional external folder and a required fresh preflight for every revision.
