# DR-321: AI Prototype Fixture Replay Report

Date: 2026-07-31  
Status: Accepted

## Decision

Returned AI-built game prototypes must show fixture replay reports before integration review can proceed. The report proves the prototype loads reviewed JSON fixtures instead of hard-coded content or tenant assumptions.

## Rationale

Outside prototypes are useful only if they can become data-driven LivingTextbook surfaces. Fixture replay is the cheapest strong evidence that a game can use the platform's unit payload, audio manifest, tenant theme tokens, scoring profile, and support-language policy.

## Required Evidence

- Reviewed unit JSON fixture coverage.
- Input assertions for unit meta, vocabulary, sentences, audio cues, and tenant theme injection.
- Output assertions for standard events and non-authoritative scoring.
- Replay evidence for parsed terms, parsed sentences, audio requests, event logs, and tenant theme injection.
- Failure triggers for hard-coded content, missing audio, support-language progress, score/reward writes, and route/assignment side effects.

## Hard Boundaries

- No live model call.
- No direct app import.
- No route registry write.
- No scoring profile mutation.
- No audio manifest mutation.
- No reward inventory write.
- No student assignment.
- No support-language scoring or release.
