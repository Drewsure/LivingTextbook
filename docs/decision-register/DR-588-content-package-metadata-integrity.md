# DR-588: Content Package Metadata Integrity

Status: Accepted

Decision: Require valid package creation timestamps and chronologically valid update timestamps.

Guardrails:

- Creation is required.
- Update is optional but valid when present.
- Update cannot precede creation.
- Validation remains side-effect free.
