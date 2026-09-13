# ADR 0691: Label It Canonical Entry Integration

## Status

Accepted

## Context

The shared recommendation policy advances a completed Match Up activity to
Label It. The Label It wrapper already had canonical event, audio, deterministic
scoring, and completion evidence, but the student and front-door launch flows
still rendered it as a preview. That created a misleading progression step and
made the next curated activity tenant-dependent.

## Decision

Mount `LabelItPracticeGame` in the student and front-door flows when the active
mode is `label-it`. It uses the same progression identity, event reference,
audio evidence, completion gate, and reviewed-asset-only boundary as the
existing canonical pairing wrappers. All other unpromoted modes remain
previews.

## Consequences

- The first three curated post-entry activities can run through a real
  canonical pathway: Match Up, Memory Match, and Label It.
- Label It remains safe for white-label tenants because live image upload is
  not enabled by this integration.
- Future uploaded diagram assets still require the existing rights, safety,
  alt-text, anchor, audio, and release gates.
- No frozen Z.ai/Phaser code is imported or activated.

## Verification

- Canonical integration verification requires Label It in both launch flows.
- Web typecheck, production webpack build, and all active route checks pass.
