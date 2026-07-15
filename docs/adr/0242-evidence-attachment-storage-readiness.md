# 0242 Evidence Attachment Storage Readiness

Status: accepted
Date: 2026-07-15

## Context

Evidence export readiness now identifies PDF, JSON, and local manifest outputs, but those outputs need a prior answer: where do supporting attachments live, and what must be true before they can be stored or shared?

The white-label platform has to support hosted pilots, closed local publisher/school deployments, and hybrid handoffs without accidentally enabling uploads, downloads, signatures, or release-state changes before policy is settled.

## Decision

Add an evidence attachment storage readiness slice on `/teacher/intake`.

It names three future storage candidates:

- Hosted object storage candidate.
- Closed local evidence folder candidate.
- Hybrid export archive candidate.

It also names required attachment metadata, storage policy gates, and blocked actions. The slice is review-only. It does not upload files, write to object storage, write to local folders, download attachments, attach signed approvals, mutate release state, or make attachments student-facing.

## Consequences

- Evidence export and signed approval work now has a concrete storage precondition.
- Hosted, local, and hybrid deployments can be compared without choosing a vendor prematurely.
- Future backend work must preserve quarantine paths, checksums, malware scan status, retention, delete/export policy, access control, backup responsibility, and release-control mutation rules before enabling storage behavior.
- `npm run verify:upload-channels` and active route checks now guard the readiness text.
