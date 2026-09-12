# DR-747: Provider-Neutral Progression Continuity Envelope

Progression continuity between entry practice and curated game routes now has
a shared validated envelope. It carries tenant, package, launch, learner
session, unit, route, event-cursor, and progression snapshot context while
rejecting identity mismatches, invalid unlock relationships, unsupported modes,
support-language evidence, media-only evidence, raw learner audio, and learner
transcripts.

The adapter remains review-only with `sideEffect: "none"`. This prevents the
platform from treating a route handoff as live learner persistence before the
backend, identity, school-policy, reporting, recovery, and release decisions
are approved. See ADR 0675 and `docs/PROGRESSION_CONTINUITY_CONTRACT.md`.
