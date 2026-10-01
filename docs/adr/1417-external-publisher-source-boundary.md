# ADR 1417: Real Publisher Source Must Remain External

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The publisher intake preflight validates structure and declared evidence, but
the saleability audit also needs to distinguish a real external handoff from
sample or reference files stored in the LivingTextBook repository.

## Decision

The first-pilot audit blocks any `--publisher-root` that resolves inside the
LivingTextBook repository. Only an external publisher folder can satisfy the
publisher-source gate. The external folder must still pass the canonical
publisher intake preflight.

## Consequences

- Repository samples remain useful for rehearsals without becoming commercial
  publisher evidence.
- A real publisher handoff has an explicit custody boundary.
- The audit remains fail-closed and does not copy or upload source files.

See `docs/decision-register/DR-1417-external-publisher-source-boundary.md`.
