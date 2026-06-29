# FR-006: Bounded AI Tutor For Upper Levels

Status: Planned; defer active implementation until after the first foundation slice is locally verified.

## Requirement

The Living Textbook platform should support an optional AI tutor layer for advanced learners, especially upper curriculum levels and older students.

The tutor must be bounded by tenant, curriculum, level, unit, approved vocabulary, target sentence structures, teacher rules, safety rules, and content-package metadata. It must not be implemented as a general open-ended chatbot.

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

## Guardrails

- No open-ended chatbot for children.
- No tutor outside current approved unit scope unless explicitly designed and reviewed.
- No model-generated grading or teacher instruction without a verified rule.
- No hard-coded MiniStar tutor identity in platform code.
- No raw transcript storage by default.
- No runaway AI cost model.
- No tutor mode without safety, privacy, and teacher/tenant control.

## First Acceptable Prototype

A first prototype should demonstrate one narrow mode, such as `Fix My Sentence` or `Explain My Mistake`, inside one upper-level unit.

It should:

1. Use only approved unit vocabulary and target sentence structures.
2. Produce short, age-appropriate correction or explanation.
3. Emit teacher-visible summary events.
4. Respect audio-first requirements where appropriate.
5. Have a clear opt-in route or teacher launch.
6. Include cost limits and verification notes.

## References

- `docs/AI_TUTOR_STRATEGY.md`
- `docs/adr/0007-bounded-ai-tutor-upper-levels.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/FUTURE_REQUIREMENTS.md`
