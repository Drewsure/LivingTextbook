# ADR 0719: Documentation Integrity Gate

## Status

Accepted

## Context

The foundation standards and decision register are living operational memory.
Repeated build sessions had introduced duplicate section numbers and a repeated
standard title. The decision register also contains historical records that are
not strictly chronological, so a verifier must distinguish genuine duplication
from valid historical ordering.

## Decision

Add `scripts/verify-standards-integrity.mjs` and invoke it from
`scripts/verify-foundation-composition.mjs`. The verifier rejects duplicate
standards IDs, duplicate standards titles, duplicate decision IDs, duplicate
decision titles, and missing cross-cutting Agent Standards subsection `11.1`.
It does not rewrite or reject valid out-of-order historical decision records.

## Consequences

Documentation becomes an executable foundation contract. Future edits that
silently duplicate standards or decisions fail early. Existing history remains
traceable without a high-churn renumbering exercise.
