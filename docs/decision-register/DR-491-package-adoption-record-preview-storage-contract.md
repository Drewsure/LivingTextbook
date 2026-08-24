# DR-491: Package Adoption Record Preview Storage Contract

Status: Accepted

Decision: Preserve package adoption record previews as backend-neutral durable records, hosted/local write intents, schema entities, migration candidates, and migration specs before any optional paid package activation can exist.

White-label impact: Strongly positive. Tenants and schools can review package adoption requirements for premium AI authoring, Voice Tutor, hosted storage, report export, and local companion delivery without hard-coding MiniStar or forcing one backend vendor.

Cost impact: Strongly positive. The platform names budget, rate-card, billing, microphone, transcript, storage, export, and rollback gates before paid services are enabled.

Constraints:

- No accepted package adoption record is stored.
- No billing entitlement write is allowed.
- No premium feature activation is allowed.
- No live model call is allowed.
- No microphone scoring enablement is allowed.
- No report export enablement is allowed.
- No hosted storage activation is allowed.
- No local companion activation is allowed.

Follow-up: Promote previews into accepted adoption records only after school policy acceptance, tenant administration, billing, persistence, report export, and rollback policies are selected.
