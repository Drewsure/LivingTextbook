# Package Readiness Verifier Checks

## Scope

Run after content package, media package, route registry, game offer, teacher report, local companion, assist-language, AI Tutor, or pilot handoff changes.

## Checks

- Confirm `npm run verify:package-readiness` passes.
- Confirm MiniStar and the sample publisher remain included in package readiness summaries.
- Confirm active package modes have explicit audio cue coverage for flashcards, Match Up, Label It, Memory Match, Balloon Pop, Quiz, True or False, Type Answer, Sentence Builder, and Speak It.
- Confirm packages retain audio and video media assets, playlist structure, local bundle paths, and non-unknown rights status.
- Confirm background media remains teacher-gated and default-off.
- Confirm front-door access requires entry code, learner/user code, and teacher-report support.
- Confirm permanent QR records target the front door and include fallback paths.
- Confirm support language remains support-only and cannot unlock target-language progression.
- Confirm AI Tutor remains explicit, optional, premium, upper-level, and disabled by default.

## Verification Command

```powershell
npm run verify:foundation
```
