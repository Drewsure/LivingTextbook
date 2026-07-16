# 0259 School Policy Revocation Rollback Preview

Status: accepted
Date: 2026-07-16

## Context

School acceptance must not be a one-way switch. Before any acceptance workflow can affect launch readiness, the platform needs a visible plan for revocation authority, rollback scope, printed QR behavior, learner data/report handling, publisher media/local package handling, and optional premium feature handling.

## Decision

Add a review-only `School policy revocation and rollback preview` derived from the future school acceptance record preview.

The preview names the rollback lanes, required policy, blocked effects, minimum rollback record fields, blocked actions, and review rules needed before acceptance can ever mutate launch readiness.

## Consequences

- Schools and partners can see the exit path before acceptance exists.
- Printed textbook QR behavior, local packages, media rights, reports, and premium features are considered before launch readiness.
- No revocation action, rollback button, release-state mutation, production QR redirect mutation, learner-data deletion, report export, media replacement, local bundle deactivation, AI Tutor entitlement change, or live classroom shutdown workflow is enabled.
