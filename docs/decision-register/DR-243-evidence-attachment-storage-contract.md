# DR-243 Evidence Attachment Storage Contract

Date: 2026-07-15

## Decision

Evidence attachment storage will be represented as metadata-first `evidence_attachment` records before any live storage behavior exists.

## Rationale

The platform needs a white-label path for hosted pilots, local publisher installations, and hybrid handoffs. All three paths must preserve the same safety facts before a file can be trusted: quarantine location, checksum, malware scan status, retention, delete/export policy, access control, and release-control blocks.

## Guardrails

- Do not store binary file bytes in the backend schema record.
- Do not allow object storage writes or local folder writes from the metadata contract.
- Do not allow attachment downloads before export policy and recipient identity.
- Do not treat local folder placement as evidence acceptance.
- Do not attach signed approvals before identity and signature policy.
- Do not mutate release state or expose attachments to students from this record.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
