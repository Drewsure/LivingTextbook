# DR-629: Persistence Contract Alignment

Status: Accepted

Decision: Cross-check the durable-record and hosted/local adapter contracts for
the tenant-bound persistence surface.

Rules:

- Shared tenant-bound categories require a durable record and adapter intent.
- Adapter intents reuse the durable record's explicit `tenantBoundaryKey`.
- Raw-audio storage and raw-audio rejection cannot conflict across layers.
- Review-only records may remain unpaired until their storage decision.

Scope: foundation verification only. No backend, provider, Z.ai import, or
student-facing behavior is enabled.

Related ADR: `docs/adr/0557-persistence-contract-alignment.md`
