# 0243 Evidence Attachment Storage Contract

Status: accepted
Date: 2026-07-15

## Context

The evidence attachment readiness panel names hosted, local, and hybrid storage candidates. The next foundation step is to preserve those rules in backend-neutral storage contracts without enabling live upload or download behavior.

## Decision

Add an `evidence_attachment` storage contract across the backend schema draft, migration candidates, migration specs, persistence adapter plans, durable record map, and backend storage verifier.

The contract preserves:

- Attachment id and evidence packet relationship.
- Storage candidate.
- Quarantine path.
- Checksum requirement.
- Malware scan status.
- Retention period.
- Delete/export policy.
- Access-control status.
- Storage write, download, and student-facing blocks.

## Consequences

- Hosted object storage and closed local storage can be compared against the same record shape.
- Future file handling cannot bypass evidence packet policy with a raw path or storage URL.
- Live upload, object/local writes, downloads, signed approval attachments, release-state mutation, and student-facing attachment use remain blocked.
