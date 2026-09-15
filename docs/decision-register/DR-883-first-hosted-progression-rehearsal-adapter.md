# DR-883: First hosted progression rehearsal adapter

**Decision:** The first hosted adapter is a gated, process-local rehearsal endpoint. It validates continuity identity, rejects invalid writes, uses continuity idempotency, and defaults to blocked unless explicit rehearsal policy is enabled.

**Reason:** It creates a real backend integration boundary while keeping cost, privacy, and durability claims honest before vendor selection.

**Not production:** Process-local state disappears on restart and is not a classroom record. A durable provider requires a new approval decision.
