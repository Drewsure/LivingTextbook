# DR-749: Progression Continuity Persistence Boundary

The provider-neutral persistence map now includes a separate
`progression-continuity` record for validated source-to-destination activity
handoffs. The record preserves the continuity envelope, compact progression
snapshot, and monotonic route handoff cursor while remaining tenant- and
package-scoped.

Hosted and local adapter intents, the backend schema draft, migration candidate,
and migration specification use the same shape. Both remain policy-gated and
review-only. Raw audio, transcripts, URL-authoritative state, cross-tenant
reuse, direct unlocks, Star Dust writes, and collection writes remain blocked.

See ADR 0677 and `docs/PROGRESSION_CONTINUITY_CONTRACT.md`.
