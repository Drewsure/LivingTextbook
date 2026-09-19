# ADR 0875: Release-Control Evidence In The Acceptance Record Chain

## Status

Accepted for foundation rehearsal.

## Context

The school policy acceptance preflight and pilot handoff package now consume a
shared release-control evidence contract. The policy text pack and future
acceptance-record preview still needed an explicit inheritance path so a later
acceptance workflow could not silently rely on a locally summarized release
state.

## Decision

Carry the exact shared release-control evidence from the school policy
acceptance preflight into the policy text pack and then into the future
acceptance-record preview. Render the binding identity, decision, and blockers
at the preview surface while preserving all no-acceptance and no-side-effect
boundaries.

## Consequences

The policy artifact chain is traceable from release binding to future record
preview. No policy text, signature, acceptance, storage, export, launch, or
release-state mutation is enabled by this chain.
