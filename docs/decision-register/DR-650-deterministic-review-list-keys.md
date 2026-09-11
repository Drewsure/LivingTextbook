# DR-650: Deterministic Review List Keys

Status: Accepted

Decision: Warning and error lists in teacher review surfaces must use unique
deterministic keys even when messages repeat.

Guardrails:

- Message text alone is not a sufficient key for repeated validator output.
- Stable domain IDs remain preferred for record-backed lists.
- The change does not hide, merge, or suppress repeated evidence.

Related ADR: `docs/adr/0578-deterministic-review-list-keys.md`
