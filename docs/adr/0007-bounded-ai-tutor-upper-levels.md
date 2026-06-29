# ADR-0007: Bounded AI Tutor For Upper Levels

Status: Accepted as future capability; deferred from first foundation implementation

Date: 2026-06-29

## Context

The Living Textbook platform is intended to become a white-label, saleable learning product. The current foundation work focuses on QR launch, audio-supported flashcards, game progression, multimedia packages, deterministic rewards, and teacher-visible reporting.

An AI tutor could become a major differentiator for older and more advanced students. It can support speaking practice, sentence correction, guided writing, role play, explanation after mistakes, and adaptive review.

However, an unbounded chatbot would introduce safety, privacy, cost, quality, and teacher-control risks. It would also distract from the current need to stabilize the core platform and reusable game/event architecture.

## Decision

The platform will preserve AI tutor capability as a planned upper-level layer, but it will not be implemented as part of the first foundation slice.

When implemented, the AI tutor must be:

- Bounded by tenant, curriculum, level, unit, approved vocabulary, and target sentence structures.
- Optional and tenant-configurable.
- More appropriate for upper levels than early learner levels.
- Teacher-visible through summarized learning events.
- Audio-capable where it supports language learning.
- Cost-controlled through short modes, usage limits, and bounded context.
- Governed by verifier and safety rules before student-facing use.

The tutor should be a set of constrained modes, not a general open chat surface.

Preferred first modes:

- Fix My Sentence.
- Explain My Mistake.
- Speak With Me.
- Role Play.
- Writing Coach.
- Review Coach.

## White-Label Impact

Positive.

A bounded AI tutor can increase the sale value of the platform for schools, publishers, academies, and curriculum owners. It can turn structured textbook units and multimedia packages into guided interactive practice.

The tutor must not hard-code MiniStar-specific characters, rules, colors, curriculum, or voices. MiniStar can be the flagship tenant, but each tenant must be able to configure tutor identity, levels, modes, tone, voice, safety rules, and data policy.

## Cost Impact

Mixed but manageable if deferred and bounded.

Potential costs include model usage, speech-to-text, text-to-speech, moderation, logging, storage, latency, and extra quality assurance. These costs are acceptable only if the core platform remains useful without AI and the tutor is activated through tenant-controlled plans.

Cost mitigations:

- Build games, audio cues, and teacher reporting first.
- Use short tutor tasks instead of open-ended conversation.
- Restrict context to the current unit where possible.
- Make tutor modes optional by tenant, level, and unit.
- Use explicit session limits and response length limits.
- Store summarized learning events by default, not raw transcripts.

## Safety And Pedagogical Constraints

The tutor must not replace teacher authority or the structured game progression.

Required constraints:

- No open-ended general chatbot for children.
- No unsupported claims, grading, or teacher instructions invented by the model.
- No interaction outside approved tenant and unit content unless a mode explicitly allows it and safety review exists.
- No raw transcript retention by default.
- No hidden relationship-building or dependency-focused companion behavior.
- No student-ready tutor mode without verifier, teacher, or tenant approval appropriate to the age group.

The tutor should reinforce learning, explain mistakes, and guide practice within the approved curriculum.

## Implementation Timing

Deferred until after the first foundation slice is locally verified.

Do not start tutor UI, tutor service, or model integration before:

1. QR/front-door launch works.
2. Flashcard practice is audio-supported.
3. At least one playable game mode emits standard events.
4. Teacher-visible progress reporting exists at prototype level.
5. Multimedia package handling is stable enough to demonstrate a unit.
6. Tenant configuration boundaries are clear.
7. Privacy and safety posture is documented.

Allowed before implementation:

- Strategy documents.
- Future schema notes.
- Content package extensibility.
- Route placeholders if they do not create active product promises.
- Verification checklist planning.

## Consequences

Positive consequences:

- Preserves a strong premium product direction.
- Keeps the current build focused on reusable platform foundations.
- Avoids unsafe or expensive chatbot sprawl.
- Supports future textbook partners who want interactive tutoring on top of PDF/unit content.

Tradeoffs:

- The first demo will not yet show AI tutor magic.
- Future schema and reporting choices must leave space for tutor events.
- More safety and privacy documentation will be required before implementation.

## References

- `docs/AI_TUTOR_STRATEGY.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/DECISION_REGISTER.md`
