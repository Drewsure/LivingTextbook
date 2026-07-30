# ADR 0305: MiniStar AI Verifier Submission Packet

Status: Accepted  
Date: 2026-07-31

## Decision

Add a blocked, review-only AI verifier submission packet for the MiniStar Level 1 greetings generator request.

The packet checks schema shape, pedagogical lock, English target-language progression, hiragana-only Japanese support boundaries, audio coverage, engine binding, gamification mapping, media rights, and teacher approval.

## Rationale

The generator should show how a MiniStar draft would enter the Vision/Reasoning review lane before any manifest, route, playlist, or assignment can exist. Adding the verifier packet proves the inspection boundary without enabling live verifier submission or paid AI services.

## Consequences

- `/teacher/generator/ministar` now shows a MiniStar-specific verifier submission packet.
- Schema, pedagogy, progress, support-language, engine, and gamification checks are visible.
- Target-language audio, media-rights, and teacher approval remain blocked.
- Submit verifier, approve package, create route, create playlist, assign students, and mark student-ready actions remain blocked.
- Package manifest and publish readiness remain the next missing MiniStar generator records.
