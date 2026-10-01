# ADR 1377: Package Evidence Reference Origin

- Status: Accepted
- Date: 2026-10-01

## Context

The package evidence review stored lane and reference IDs but did not preserve
whether a reference described a publisher-supplied asset or a platform-derived
game record. That weakened custody clarity at the reviewer handoff.

## Decision

Add an explicit origin to each package evidence reference: `publisher-asset`
or `platform-derived`. The review UI and API must require the origin. The game
lane is marked platform-derived; content and media lanes are marked
publisher-asset by the current pilot workflow.

## Consequences

Reviewer records and downstream handoffs can distinguish uploaded evidence
from canonical platform evidence. The distinction remains metadata-only and
does not authorize package assembly, release, QR printing, persistence, or
student use.
