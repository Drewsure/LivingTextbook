# DR-490: Package Adoption Record Preview

Status: Accepted

Decision: Add future package adoption record previews that define minimum fields, evidence, acceptance scopes, blocked writes, and rollback hooks before any premium package activation can exist.

White-label impact: Positive. Schools and publishers can see what records would be required for premium adoption while the platform remains tenant-neutral and policy-first.

Cost impact: Positive. The build avoids premature billing, storage, speech, and local-companion implementation by naming the accepted-record requirements first.

Constraints:

- No accepted adoption record is stored.
- No accepted terms are stored.
- No billing entitlement write.
- No model-call enablement write.
- No microphone scoring enablement write.
- No report export or local bundle activation write.

Follow-up: Promote these previews into durable package adoption records only after persistence, school policy acceptance, tenant administration, and billing boundaries are selected.
