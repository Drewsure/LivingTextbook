# DR-241: Evidence Export Readiness Gate

## Decision

Expose evidence export readiness on `/teacher/intake` before building any real export or signature workflow.

## Rationale

Evidence packet handoff needs a practical next step, but export controls are risky if they arrive before identity, storage, retention, audit, and release-control rules. A review-only readiness panel gives the product a clear commercial path without overpromising operational readiness.

## Implications

- Planned formats include reviewer summary PDF, machine-readable JSON packet, and local companion evidence manifest.
- Recipient lanes include publisher reviewer, school approver, and platform operator.
- Identity/signature gates and retention/policy gates are visible.
- Export, signed approvals, PDF generation, JSON export, downloadable ZIPs, email handoff, release-state mutation, and student assignment from export stay blocked.
- Upload-channel and active-route verification cover the panel.

## Next

Only implement export mechanics after authenticated reviewer identity, evidence attachment storage, retention/export policy, and release-control state handling are accepted.
