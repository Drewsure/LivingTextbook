# ADR 0417: Package Entitlement Workbench Route

Status: Accepted

## Context

The platform needs optional premium capabilities such as AI generation, AI Tutor, Voice Tutor, microphone scoring, speech APIs, hosted storage, report export, and local companion delivery. These are commercially important, but they can create usage cost, privacy duties, and school approval requirements. They need a visible teacher/admin boundary before any live billing, microphone prompt, or package activation exists.

## Decision

Add `/teacher/entitlements` as a review-only package entitlement workbench. The route gathers AI generation cost gates, Voice Tutor package readiness, tenant AI Tutor availability, microphone/speech boundaries, storage/export blockers, and local companion package boundaries.

## Consequences

- The base product remains usable without premium services.
- Optional paid features remain adult-controlled tenant/school package decisions.
- Children do not see upgrade prompts or spending-triggering controls.
- AI generation, speech scoring, raw audio, transcripts, report export, hosted storage, and local companion writes remain blocked until package, policy, budget, and persistence gates pass.
- Active route verification now checks the entitlement workbench and grows to 82 routes.
