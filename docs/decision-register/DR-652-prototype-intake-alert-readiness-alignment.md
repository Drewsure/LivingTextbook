# DR-652: Prototype Intake Alert Readiness Alignment

Status: Accepted

Decision: Validate the Z.ai prototype intake alert status against the derived readiness lanes before treating the alert contract as valid.

Guardrails:

- A ready-looking payload cannot override missing or blocked readiness lanes.
- A valid alert remains a review-only signal and does not imply a returned package.
- Import, route creation, scoring/reward mutation, package promotion, and assignment remain blocked.

Related ADR: `docs/adr/0580-prototype-intake-alert-readiness-alignment.md`
