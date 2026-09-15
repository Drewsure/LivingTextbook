# ADR 0804: Browser Rehearsal Evidence Bridge

- Status: accepted
- Date: 2026-09-15
- Decision owners: Living Textbook architecture

## Context

The student launch flow already creates the canonical event stream and
progression state, while the teacher report previously displayed only a static
sample stream. A production-shaped slice needs a visible proof that the
student result can reach the teacher surface, but live hosted persistence is
still gated by school policy, privacy, retention, access, and release control.

## Decision

Add a same-origin browser rehearsal adapter that stores only coded
`StudentProgressionState` and `GameProgressEvent[]` for the current launch
code. The student flow writes it after an event is recorded. The teacher
session route reads it on the client and displays a clearly labelled rehearsal
evidence panel, including cross-tab updates.

The adapter is not a production persistence provider. It must not store names,
raw audio, transcripts, hosted sync state, or export records. Storage failure
is swallowed so learner gameplay remains functional. The shared event and
progression contracts remain authoritative; local storage is only a transport
for browser rehearsal evidence.

## Consequences

- The teacher can inspect the actual demo event stream after completing a
  student session, making the vertical slice genuinely connected.
- The path remains safe for review because it is explicit, coded, local-only,
  and non-authoritative.
- A future hosted or packaged adapter can be tested against the same evidence
  shape without changing game components.
- Live classroom reporting and export remain blocked until the existing policy
  and persistence gates are accepted.

## Verification

```text
npm run verify:vertical-slice
npm run typecheck --workspace @living-textbook/web
npm run verify:foundation
```
