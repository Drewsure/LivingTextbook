# FR-006: Bounded AI Tutor For Upper Levels

Status: Planned optional premium package; defer active implementation until after the first foundation slice is locally verified.

## Requirement

The Living Textbook platform should support an optional AI tutor layer for advanced learners, especially upper curriculum levels and older students.

The tutor must be bounded by tenant, curriculum, level, unit, approved vocabulary, target sentence structures, teacher rules, safety rules, and content-package metadata. It must not be implemented as a general open-ended chatbot.

## Package And Entitlement Rule

AI Tutor is not a baseline requirement for the core Living Textbook product.

It is an optional paid or premium package that a school, publisher, academy, or tenant may choose to adopt. The core platform must remain fully useful without AI Tutor:

- QR/front-door launch.
- Audio-first flashcards.
- Game progression.
- Multimedia packages.
- Earned rewards.
- Teacher launch protocols.
- Teacher-visible progress reporting.

AI Tutor adds premium value for speaking, writing, correction, role play, and adaptive review, but it creates ongoing model, speech, moderation, safety, storage, and infrastructure costs. Therefore it must be controlled through tenant feature entitlements, usage limits, enabled levels, allowed modes, and package pricing.

No school or tenant should be forced into AI operating costs for the Living Textbook platform to function.

## Why It Matters

A bounded AI tutor can become a premium white-label feature for schools, academies, publishers, and textbook partners.

It can provide:

- Speaking practice.
- Sentence correction.
- Guided writing support.
- Role-play practice.
- Explanation after game mistakes.
- Adaptive review based on standard progress events.
- Teacher-visible learning summaries.

## Build Standard

Design for this capability now, but do not build the active tutor before the core platform foundation is stable.

Foundation first:

1. QR/front-door launch.
2. Audio-first flashcards.
3. Standard game events.
4. Playable first game sequence.
5. Progress summary.
6. Multimedia package support.
7. Teacher-visible report preview.
8. Tenant configuration boundary.

After that, tutor work may begin through a narrow upper-level prototype.

## Entitlement Shape

Future tenant configuration should be able to express AI Tutor availability as a package entitlement.

Planning shape:

```json
{
  "feature_entitlements": {
    "ai_tutor": {
      "enabled": false,
      "package": "premium",
      "allowed_levels": [6, 7, 8],
      "allowed_modes": ["fix_my_sentence", "role_play", "review_coach"],
      "monthly_usage_limit": 1000,
      "teacher_enabled": true,
      "school_enabled": true
    }
  }
}
```

This is a planning shape, not a final schema.

## Guardrails

- No open-ended chatbot for children.
- No tutor outside current approved unit scope unless explicitly designed and reviewed.
- No model-generated grading or teacher instruction without a verified rule.
- No hard-coded MiniStar tutor identity in platform code.
- No raw transcript storage by default.
- No runaway AI cost model.
- No tutor mode without safety, privacy, and teacher/tenant control.
- No AI Tutor dependency inside baseline QR, flashcard, game, multimedia, reward, or report flows.

## First Acceptable Prototype

A first prototype should demonstrate one narrow premium-gated mode, such as `Fix My Sentence` or `Explain My Mistake`, inside one upper-level unit.

It should:

1. Use only approved unit vocabulary and target sentence structures.
2. Produce short, age-appropriate correction or explanation.
3. Emit teacher-visible summary events.
4. Respect audio-first requirements where appropriate.
5. Have a clear opt-in route or teacher launch.
6. Include cost limits and verification notes.
7. Be disabled cleanly when the tenant does not subscribe to AI Tutor.

## References

- `docs/AI_TUTOR_STRATEGY.md`
- `docs/adr/0007-bounded-ai-tutor-upper-levels.md`
- `docs/adr/0008-ai-tutor-premium-entitlement.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/FUTURE_REQUIREMENTS.md`
