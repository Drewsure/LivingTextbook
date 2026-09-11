# ADR 0574: Codex Decision Check Identity

Status: Accepted

## Decision

Require every Codex integration-decision evidence check to have one unique
label and one unique required record. Each check must also include non-empty
evidence and use a supported review status.

## Context

The Codex decision is the final review boundary before any future prototype
integration. Presence-only validation could accept duplicate check identities,
which would make a packet appear complete while leaving one evidence lane
ambiguous or silently replacing another.

## Consequences

- Evidence provenance stays one-to-one and auditable.
- Malformed extra checks cannot hide behind a valid overall status.
- The rule remains provider-neutral and applies equally to DOM, Phaser, and
  hybrid prototype returns.
- No integration approval, app write, route change, score/reward change,
  package promotion, playlist write, or assignment is enabled.

## Verification

Runtime behavior verification must cover valid packets, duplicate labels,
duplicate required records, missing evidence, and unsupported check statuses.
The full foundation verification remains required before push.
