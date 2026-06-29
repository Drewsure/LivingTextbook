# ADR-0008: AI Tutor As Optional Premium Entitlement

Status: Accepted

Date: 2026-06-29

## Context

The Living Textbook platform must be saleable as a white-label product for schools, academies, textbook partners, and publishers.

AI Tutor capability can add strong premium value, especially for upper-level speaking, writing, correction, role play, and adaptive review. However, AI Tutor also creates ongoing costs and responsibilities: model usage, speech-to-text, text-to-speech, moderation, safety checks, storage, latency, privacy, and support.

The core Living Textbook product must not depend on those recurring AI costs.

## Decision

AI Tutor will be treated as an optional premium entitlement, not a required baseline platform feature.

The core product must work without AI Tutor:

- QR/front-door launch.
- Audio-first flashcards.
- Game progression.
- Multimedia packages.
- Earned rewards.
- Teacher launch protocols.
- Teacher-visible progress reporting.

Schools, publishers, or tenants may adopt AI Tutor as a paid or advanced package. Tenant and school administrators must be able to enable or disable it. Teacher-controlled activation should be supported where appropriate.

## Architecture Rule

AI Tutor availability must be represented through tenant feature entitlement or package configuration, not hard-coded UI assumptions.

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

## White-Label Impact

Positive.

This lets the platform support multiple commercial packages:

- Core Living Textbook.
- Multimedia companion.
- Games and gamification.
- Teacher reporting.
- Premium AI Tutor.

Smaller schools can use the core product without AI costs. Premium schools or publishers can pay for AI Tutor when they want advanced practice and adaptive review.

## Cost Impact

Positive if enforced.

The decision prevents baseline subscriptions from carrying uncontrolled AI costs. It also allows future pricing, usage limits, and model-provider choices to be adjusted without rebuilding the core product.

Cost controls must include:

- Tenant-level enable/disable.
- Level and mode restrictions.
- Session or monthly usage limits.
- Short bounded prompts and responses.
- Optional speech features.
- Teacher/school activation controls.
- Reporting that distinguishes AI Tutor usage from normal game progress.

## Consequences

Positive consequences:

- Keeps the core product affordable and viable.
- Makes AI Tutor a clear premium upgrade.
- Protects white-label tenants from unwanted AI cost exposure.
- Keeps AI implementation modular and replaceable.

Tradeoffs:

- AI Tutor screens must handle disabled states gracefully.
- Product packaging and billing rules will eventually need a tenant entitlement model.
- Teacher reporting must separate AI Tutor usage from baseline learning progress.

## References

- `docs/AI_TUTOR_STRATEGY.md`
- `docs/future-requirements/FR-006-bounded-ai-tutor-upper-levels.md`
- `docs/adr/0007-bounded-ai-tutor-upper-levels.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
