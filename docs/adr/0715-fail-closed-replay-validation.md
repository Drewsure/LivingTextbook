# ADR 0715: Fail-Closed Replay Validation

- Status: Accepted
- Date: 2026-09-14
- Decision owner: Codex architecture review

## Context

Canonical replay validation previously accepted any string beginning with
`replay-v1:`. It also called `.trim()` directly on `unitKey`, which could throw
when malformed runtime evidence omitted that field. Candidate packages and
future provider payloads are untrusted at this boundary.

## Decision

Expose `isCanonicalGameReplaySeed` from the content model and require a
non-empty transport-safe seed shape. Use non-blank string reads for unit
identity so malformed input produces a normal validation error. Keep all
failed evidence outside progression, reporting, rewards, and persistence.

## Consequences

- Empty and unsafe replay seeds are rejected before canonical completion.
- Missing unit identity is reported instead of crashing the validator.
- Existing generated seeds remain valid and unchanged.
- Runtime verification covers both rejection paths.
