# DR-1019: Opt-in publisher file intake surface

## Decision

Expose a real tenant-scoped file picker only when the explicit quarantine
upload gate is enabled. Keep the default publisher upload route input-free and
review-only.

## Why

The pilot must accept actual publisher files, but a submitted file is not yet a
reviewed multimedia/game package. The interface therefore needs to distinguish
submission, quarantine custody, review, evidence, release, and student use.

## Contract

- Intake uses the existing same-origin multipart quarantine route.
- Accepted files receive checksum-bound quarantine metadata.
- The response exposes review links, not raw storage paths or download URLs.
- Promotion, package assembly, QR printing, hosted writes, and student-facing
  use remain blocked.
- Default rendering contains no file input; opt-in rendering may contain one.

## Human follow-up

An operator must provision the custody root and explicitly enable the server
gate before a real publisher submission is attempted. This is a pilot
operations decision, not an automatic deployment behavior.
