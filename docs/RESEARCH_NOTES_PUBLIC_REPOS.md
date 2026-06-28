# Public Repository Research Notes

This document records how Living Textbook should use public repositories, open-source libraries, public assets, and best-practice examples without losing white-label control or creating license risk.

No external code or assets have been imported into the canonical app from this document yet.

## Standing Rule

Before building a major system from scratch, run a focused public-repository and best-practice research pass.

This applies especially to:

- parent game engines,
- flashcard, memory, matching, quiz, spelling, and arcade modes,
- accessible audio and video playback,
- PWA offline behavior,
- classroom QR/session flows,
- reward catalogs and collection rooms,
- avatar or virtual-pet systems,
- AI content validation and JSON schema tooling,
- content packaging and offline media bundles.

## Adoption Gate

Nothing from a public repository or asset source may enter `apps/web`, `apps/ai-service`, shared packages, or production design assets until the following are recorded:

- Source URL
- Repository or asset owner
- License
- Whether commercial white-label use is allowed
- Whether modification and redistribution are allowed
- Attribution requirements
- Maintenance activity
- Security or dependency risks
- Accessibility and mobile/PWA fit
- White-label fit
- Cost impact
- Integration plan
- Rejection reason, if not adopted

## Preferred Uses

Prefer:

- established libraries with clear APIs,
- architecture patterns that inform our own implementation,
- small reusable utilities with compatible licenses,
- public examples that shape task specs for Z.ai or other agents,
- asset pipelines with clear provenance and commercial rights.

Avoid:

- copying large game screens directly into the platform,
- importing unclear-license assets,
- adopting public code that hard-codes a non-white-label brand,
- taking on abandoned dependencies without a fallback plan,
- using GPL/AGPL-style code in production without an explicit legal and distribution decision,
- mixing external code into canonical routes without an integration plan.

## Research Note Template

Use this template when evaluating a candidate.

```md
## Candidate: [name]

Source: [URL]
Type: library / repo / asset pack / pattern / article
License: [license]
Status: candidate / adopted / rejected / parked
Area: game engine / media / PWA / reward / AI verifier / other

Summary:

White-label impact:

Cost impact:

Technical fit:

Accessibility/mobile fit:

Risks:

Decision:

Next action:
```

## Current Checkpoint

A quick memory-game research pass did not identify a clean candidate worth importing into the current foundation slice. The current Memory Match implementation therefore remains small, local, and parent-engine-oriented while public-repo research stays mandatory before larger engine work.

## Next Research Passes

Suggested next passes:

1. Phaser or React game-engine patterns for pairing, selection, text/spelling, and narrative parent engines.
2. Accessible audio/video player libraries that support mobile classrooms, subtitles, transcripts, and offline packaging.
3. PWA offline content-package patterns for local or closed textbook companion deployments.
4. Open-source reward, avatar, virtual pet, and collection-room patterns that can remain child-safe and white-label.
5. JSON schema validation and AI output verification libraries for the AI Authoring Studio and Vision/Verifier layer.

## Related Records

- `docs/FUTURE_REQUIREMENTS.md` FR-003
- `docs/DECISION_REGISTER.md` DR-010
- `docs/PRINCIPLES_AND_STANDARDS.md`
