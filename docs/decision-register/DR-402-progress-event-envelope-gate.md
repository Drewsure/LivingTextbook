# DR-402: Progress Event Envelope Gate

Date: 2026-08-11

## Decision

Teacher session monitor routes now expose a read-only progress event envelope gate. The gate wraps sample `GameProgressEvent` records into the future storage shape and validates event IDs, event types, taxonomy effects, taxonomy version, event acceptance gate binding, unit, mode, timestamp, and support-only metadata safety.

## Rationale

Games, media, speech practice, AI Tutor, rewards, assignments, reports, and uploads will all emit or consume event records. The platform needs a shared envelope before real storage so future engines cannot create hidden progress, Star Dust, mastery, or report side effects.

## Consequences

- Session reports show `Progress event envelope gate`, `Envelope guard active`, and `Standard event contract`.
- Support-only envelopes cannot award Star Dust, unlock progress, or grant mastery credit.
- The gate remains preview-only until policy, persistence, roster identity, report export, and launch gates are accepted.
- `verify:taxonomy` and active-route checks fail if the shared guard or visible session gate disappears.
