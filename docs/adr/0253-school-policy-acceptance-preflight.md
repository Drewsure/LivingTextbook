# 0253 School Policy Acceptance Preflight

Status: accepted
Date: 2026-07-16

## Context

The school policy handoff packet gives partners and schools a readable discussion surface, but a future acceptance workflow would require stricter proof than a meeting note. The platform needs to show the acceptance requirements early without adding an accept button or live approval workflow.

## Decision

Add a review-only `School policy acceptance preflight` derived from the school policy handoff packet and reviewer identity/signature gate.

The preflight names the lanes that must close before any future school policy acceptance workflow exists: authenticated school approver, policy text and scope, evidence packet and attachment readiness, release-control binding, child safety and progression boundaries, and hosted/local rollback readiness.

## Consequences

- School and publisher review can see what a real acceptance will require.
- Future implementation must bind acceptance to a known release candidate, handoff packet version, school approver identity, policy text version, learner-data policy, storage policy, support-language rules, microphone/AI Tutor opt-ins, and rollback plan.
- No accept button, policy acceptance workflow, signed approval capture, evidence export, storage activation, release-state mutation, launch-ready status, production QR promise, learner data collection, report export, AI Tutor activation, support-language-only progression, or live classroom workflow is enabled.
