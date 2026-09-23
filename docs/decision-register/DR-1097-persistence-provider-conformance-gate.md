# DR-1097: Persistence Provider Conformance Gate

- Provider conformance is now part of the mandatory persistence runtime gate.
- Process-memory and SQLite must agree on idempotency, conflicts, tenant
  isolation, event-stream privacy, and restart durability.
- The gate uses temporary synthetic data and does not authorize browser writes,
  hosted cloud provider selection, or production learner persistence.

References: ADR 1097, Build session 1011, and the durable progression storage
verification checklist.
