# 0251 School Policy Handoff Storage Contract

Status: accepted
Date: 2026-07-16

## Context

The school policy handoff packet is visible as a review-only artifact, but a white-label platform needs the packet shape to be durable before school meeting notes, evidence needs, deferred decisions, blocked actions, and local/hosted handoff metadata can be audited.

## Decision

Add `school_policy_handoff_packet` as a backend-neutral durable record category.

The record preserves handoff packet sections, evidence needed, deferred decisions, blocked actions, release candidate references, and source school launch policy gate references. Hosted and local adapter plans include matching write intents, but both remain policy-blocked.

## Consequences

- School meeting packets can later become auditable without being stored as UI-only state.
- Hosted and closed/local deployments use the same record vocabulary.
- Future acceptance and evidence export workflows get a clear boundary before implementation.
- No policy acceptance, signed approval capture, evidence export, release mutation, launch-ready status, local activation, production QR promise, learner data, report export, or live classroom workflow is enabled by this slice.
