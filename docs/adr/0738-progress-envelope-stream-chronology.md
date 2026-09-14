# ADR 0738: Progress Envelope Stream Chronology

## Status

Accepted

## Context

Progress-event envelopes validate their own ISO timestamps, but a valid batch
could still place a later event before an earlier event. Report previews and
future hosted/local persistence adapters could then reconstruct an inaccurate
learning timeline.

## Decision

`validateProgressEventEnvelopeStream` must require non-decreasing
`occurred_at` order for entries with valid timestamps. Individual envelope
validation remains responsible for malformed timestamp diagnostics; the stream
helper does not repair malformed values.

## Consequences

Browser, report, persistence, and future Phaser adapters receive deterministic
chronology diagnostics before interpreting a batch. Class reports may still
contain multiple learner session IDs when they share one launch context. This
does not enable live storage, reporting export, progression, rewards,
assignment, or source promotion.

## Verification

Run `npm run verify:runtime-behavior`, `npm run verify:taxonomy`, both workspace
typechecks, and `npm run verify:foundation`.
