# 0254 School Policy Acceptance Preflight Storage Contract

Status: accepted
Date: 2026-07-16

## Context

The school policy acceptance preflight is visible as a review-only planning artifact, but a white-label platform needs the preflight requirements to become durable before any future accept button, signature capture, evidence export, storage activation, or launch-ready workflow is designed.

## Decision

Add `school_policy_acceptance_preflight` as a backend-neutral durable record category.

The record preserves preflight lanes, missing-before-acceptance items, blocked actions, minimum acceptance fields, operating rules, release candidate references, school policy handoff packet references, and reviewer identity/signature gate references. Hosted and local adapter plans include matching write intents, but both remain policy-blocked.

## Consequences

- Future school acceptance work has a clear preflight record before implementation.
- Hosted and closed/local deployments use the same record vocabulary.
- The product can explain the difference between a school discussion packet, a preflight checklist, and a real acceptance workflow.
- No accept button, policy acceptance workflow, signed approval capture, evidence export, storage activation, release mutation, launch-ready status, production QR promise, AI Tutor activation, learner data, report export, support-language-only progression, or live classroom workflow is enabled by this slice.
