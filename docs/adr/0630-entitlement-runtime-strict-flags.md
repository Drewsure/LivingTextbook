# ADR-0630: Entitlement Runtime Strict Flags

Status: Accepted

## Decision

The entitlement runtime boundary must validate teacher, school, privacy, cost,
persistence, release, usage, level, and target-language audio fields as actual booleans.

## Required behavior

- Teacher approval, school policy, privacy policy, cost policy, persistence, release
  approval, allowed levels, usage limits, and target-language audio fields must be
  booleans.
- Stringified values must produce deterministic validation errors and must not control
  AI Tutor, microphone practice, package-tier, premium-cost, or student-facing feature
  decisions.
- AI Tutor remains premium/enterprise-only and microphone practice remains teacher,
  school, privacy, cost, and target-language gated.

## Guardrails

This is a review-only boundary. It does not activate entitlements, bill providers,
record microphone input, dispatch AI Tutor requests, unlock features, or enable
Z.ai/game integration.

## Verification

Run `npm run verify:entitlement-runtime`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation`.
