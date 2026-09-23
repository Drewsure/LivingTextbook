# DR-1127: Composite Evidence Pilot Binding

## Decision

Carry the exact composite evidence packet and adjudication identity into the
pilot review surface. The derived state is awaiting evidence until an
adjudication exists, blocked when the adjudication is blocked, and accepted
for pilot review only after an accepted three-lane adjudication.

## Status

Implemented and verified as review-only binding.

## Guardrail

The binding never becomes pilot approval. Launch, collection, export,
promotion, QR mutation, and hosted persistence remain blocked in every state.

