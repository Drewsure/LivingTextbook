# DR-328: AI Prototype Mobile Accessibility Storage Contract

## Decision

The platform will preserve AI prototype mobile accessibility reports as backend-neutral durable records before returned prototypes can claim mobile or integration readiness.

## Rationale

Phone-first QR classrooms, young learner touch targets, visible text, focus order, accessible wrapper controls, and support-language readability are product obligations. They must be stored as review evidence for both hosted and closed local deployments before any returned prototype can move toward the real app.

## Implementation Notes

- The storage contract is `ai_prototype_mobile_accessibility_report` / `ai-prototype-mobile-accessibility-report`.
- Schema draft, migration candidates, migration specs, durable records, persistence adapter plans, and route verification now include the record.
- The record preserves activity compatibility snapshot id, template rendering profile id, font accessibility profile id, standard event contract id, viewport evidence, touch target checks, keyboard/focus checks, readable text checks, visual stability checks, wrapper control checks, failure triggers, and blocked actions.
- Accessibility waivers, student-facing previews, direct app imports, route writes, package promotion, and assignments remain blocked.
- Hosted and local classroom deployment paths use the same contract shape.

## Follow-Up

Keep the next prototype review record focused on deterministic scoring replay before any returned game can move toward `apps/web` integration.
