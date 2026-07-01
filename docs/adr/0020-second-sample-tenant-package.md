# ADR 0020: Second Sample Tenant Package

Status: Accepted

Date: 2026-07-01

## Context

The platform must be saleable as a white-label Living Textbook product. MiniStar is the flagship tenant, but the codebase needs an early proof that tenant branding, rewards, content packages, launch routes, multimedia plans, audio support, and speaking practice are not hard-coded to MiniStar.

## Decision

Add a second sample tenant and a partner-style content package before adding more visual polish.

The second tenant uses:

- a distinct tenant config,
- a different reward name,
- no Japanese assist-language package,
- a PDF-derived sample package shape,
- its own textbook identifiers,
- its own audio/video media catalog,
- the shared launch route,
- the shared Speak It route,
- the shared teacher launch, progression, multimedia, and microphone approval components.

## Consequences

The platform now has a code-level white-label proof route at `/partner-demo`, plus partner launch routes at `/launch/partner-demo-unit-1` and `/speak/partner-demo-unit-1`.

This does not finish partner onboarding. It deliberately remains a static reviewed sample package until a real import/review pipeline and persistence layer are designed.

## Guardrails

- Do not fork the app into MiniStar screens and partner screens.
- Do not promote partner content into global defaults.
- Do not treat placeholder partner media paths as production assets.
- Keep target-language engagement as the progression trigger.
- Keep AI Tutor and AI speech scoring disabled unless a tenant adopts the premium package.
