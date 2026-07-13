# DR-188: Review Audit Trail Preview

## Decision

Show a preview-only audit trail on the teacher draft review queue.

## Rationale

Review handoff, reviewer decisions, and evidence packets need visible accountability before real workflow storage exists. A preview trail clarifies the intended sequence while preventing accidental live approval, publish, upload, or assignment behavior.

## Implications

- `/teacher/review` shows audit trail events for handoff, reviewer decision, evidence blocking, and approval-ledger blocking.
- Audit trail events are preview-only and cannot change package state.
- Future durable workflow storage must preserve the audit sequence before live reviewer actions are enabled.

## Next

Add a backend-neutral audit trail storage contract only after the preview language and teacher review route are stable.
