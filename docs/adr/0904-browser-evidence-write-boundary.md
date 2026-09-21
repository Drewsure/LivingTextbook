# ADR 0904: Browser Evidence Write Boundary

## Status

Accepted

## Decision

Every browser rehearsal evidence write, including the lower-level save helper,
must validate the complete v4 evidence shape and canonical identity before
touching localStorage.

## Consequences

- Future callers cannot bypass the append-path identity checks by calling the
  lower-level save function.
- Invalid records fail without replacing an existing valid record.
- The write remains browser-local and review-only.

## Verification

Run `node scripts/verify-local-evidence-runtime.mjs` and the full foundation
gate.
