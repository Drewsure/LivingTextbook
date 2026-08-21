# ADR 0415: Teacher Session Settings Workbench Route

Status: Accepted

## Context

Teacher session settings already carry several foundation-critical rules: learner audio is required, support language is support-only, microphone practice requires approval, background media must yield to learning audio, AI Tutor is an optional paid package, and report export remains policy-bound. Those rules were visible inside the large teacher intake and session monitor surfaces, but they needed a focused review route before any real setting save is considered.

## Decision

Add `/teacher/session-settings` as a review-only teacher workbench. The route shows sample launch-session settings snapshots, settings persistence warnings, teacher controls, and session settings review packets for the MiniStar and sample publisher launch sessions.

## Consequences

- Teacher/session choices become easier to review without hunting through the full intake dashboard.
- The route explicitly blocks setting saves, live classroom launch, support-language progress, raw microphone audio upload, AI Tutor activation, and report export.
- The active route verifier now checks the route for the key safety markers.
- Future hosted or closed-local persistence work must preserve this route's settings snapshot and review packet before live teacher settings can exist.
