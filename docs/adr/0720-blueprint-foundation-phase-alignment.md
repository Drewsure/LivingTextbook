# ADR 0720: Blueprint Foundation Phase Alignment

## Status

Accepted

## Context

The original blueprint described several immediate decisions as though they
were still open. Subsequent foundation work has settled the tenant, branch,
avatar, first-game, and static-authoring direction while keeping backend
provider choice policy-controlled. The project also now has a controlled Z.ai
intake gate and an isolated frozen Phaser snapshot.

## Decision

Update the blueprint to distinguish recorded foundation decisions from the next
controlled candidate gate. The canonical learner sequence is Flashcards to
Memory Match, with MiniStar as the flagship tenant and tenant configuration as
the platform default. External Phaser source remains isolated until a complete
return package passes review.

## Consequences

The blueprint is actionable for future agents and partner conversations without
implying that provider selection or source integration is already approved.
The remaining external handoff is explicit and does not block continued
provider-neutral foundation hardening.
