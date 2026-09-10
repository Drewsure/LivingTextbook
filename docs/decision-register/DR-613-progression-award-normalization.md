# DR-613: Progression Award Normalization

Status: Accepted

Decision: Normalize malformed Star Dust calculation inputs and local completion awards before event or state use.

Rationale:

- Future adapters must not be able to pass malformed reward values through a safe profile.
- Event metadata and progression state must agree.

Guardrails:

- Negative, fractional, and non-finite inputs normalize deterministically.
- Completion awards are capped at 1,000 Star Dust.
- No persistence, inventory, report, or unlock provider is activated.

See also: `docs/adr/0541-progression-award-normalization.md`.
