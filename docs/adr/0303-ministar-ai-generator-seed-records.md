# ADR 0303: MiniStar AI Generator Seed Records

Status: Accepted  
Date: 2026-07-31

## Decision

Add first review-only MiniStar generator seed records for the Level 1 greetings request.

The seed covers prompt package, cost and entitlement gate, disabled request builder, audio coverage, gamification mapping, derived reward readiness, and parent-engine binding.

## Rationale

MiniStar is the flagship tenant and should prove that the AI teaching game generator is white-label-ready without becoming hard-coded. The route should show real MiniStar-specific records while still exposing missing Draft JSON, verifier, manifest, publish readiness, and correction queue lanes.

This gives the platform a practical next-step path: build MiniStar records from reviewed source evidence, verify them, then promote only after the same tenant coverage, audio, reward, review, and release gates pass.

## Consequences

- `/teacher/generator/ministar` now shows tenant-specific MiniStar seed records instead of an empty generator scaffold.
- English remains the target-language progress trigger.
- Japanese support remains teacher-enabled, hiragana-only for Foundation/Bronze/Plus, and support-only.
- Speech scoring and AI Tutor remain separate premium-disabled options.
- Live model calls, generated Draft JSON, verifier submission, package assembly, route creation, playlist creation, and student assignment remain blocked.
