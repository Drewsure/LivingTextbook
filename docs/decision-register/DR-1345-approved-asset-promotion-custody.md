# DR-1345: Approved Asset Promotion Custody

The controlled pilot needs a real server-side bridge between reviewed publisher uploads and the approved asset store. Review packets remain review-only; they cannot copy files. Promotion is therefore a separate, explicit, fail-closed operation bound to accepted release lineage, durable delivery metadata, reviewed package evidence, exact checksums, channel/MIME/unit mapping, and safe destination paths. The promotion writer is disabled by default, idempotent, immutable, and student-disabled. It records approved asset custody without creating learner records, mutating QR aliases, or activating hosted persistence. See ADR 1346.

