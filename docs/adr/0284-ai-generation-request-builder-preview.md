# ADR 0284: AI Generation Request Builder Preview

Status: Accepted  
Date: 2026-07-31

## Decision

Add a disabled AI generation request-builder preview to the teacher generator route.

The request builder captures the future setup fields for source evidence, target level, unit theme, target language, assist-language policy, curated mode pathway, audio coverage, and AI package state. Generation, API cost estimation, request submission, live prompt dispatch, model billing, route creation, and student assignment remain blocked.

## Rationale

The white-label product needs to show how a publisher or teacher would request AI-assisted game packages without activating a paid or risky workflow too soon.

## Consequences

- The generator route now reads like a real workflow: request setup, draft JSON preview, then review gates.
- The scaffold remains static and review-only.
- Future live AI work must implement persistence, entitlement, cost, verifier, and approval records before enabling the disabled controls.
