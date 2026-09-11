# DR-651: Prototype Intake Alert Contract

Status: Accepted

Decision: Validate the Z.ai prototype intake alert as a review-only contract with explicit handoff timing, evidence requirements, isolated repository scope, Codex ownership, and blocked actions.

Guardrails:

- The alert must not request source handoff while it is not ready.
- Direct app writes, route creation, scoring/reward mutation, playlist writes, package promotion, and assignment remain blocked.
- A valid preview alert does not imply a returned prototype package.

Related ADR: `docs/adr/0579-prototype-intake-alert-contract.md`
