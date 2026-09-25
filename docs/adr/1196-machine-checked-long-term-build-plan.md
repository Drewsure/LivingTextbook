# ADR 1196: Machine-Checked Long-Term Build Plan

## Decision

The long-term white-label build map is validated as part of foundation
composition. The validator requires all governed delivery phases, the active
Z.ai evidence gate, target-language progression authority, deterministic
rewards, and source-isolation boundaries to remain visible in the roadmap.

## Why

The platform spans several phases and many review-only workbenches. A roadmap
that is only prose can drift while individual checks remain green. A small
machine check keeps the phase map aligned with the actual delivery contract
without turning roadmap text into production authority.

## Consequences

- Roadmap drift fails the foundation composition check.
- The check does not approve persistence, uploads, candidates, routes, or
  student launch.
- The plan remains readable and editable as documentation.
