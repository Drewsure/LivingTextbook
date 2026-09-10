# DR-614: Reserved Completion Metadata

Status: Accepted

Decision: Write normalized `earnedStarDust` after optional completion metadata so the platform-owned award cannot be overwritten.

Rationale:

- Event metadata must match learner state.
- Game-specific context must not become score authority.

Guardrails:

- Optional metadata is merged first.
- Normalized `earnedStarDust` is written last.
- No persistence, inventory, reporting, or unlock provider is activated.

See also: `docs/adr/0542-reserved-completion-metadata.md`.
