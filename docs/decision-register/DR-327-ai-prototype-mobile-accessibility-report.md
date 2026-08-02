# DR-327: AI Prototype Mobile Accessibility Report

## Decision

The platform will require a review-only AI prototype mobile accessibility report before returned prototypes can continue toward integration review.

## Rationale

White-label game prototypes must work in the real classroom path: teacher QR launch, student phone or tablet use, young learner touch targets, readable instructions, tap-to-speak controls, and accessible fallback behavior. A premium Phaser surface is useful only if it remains a removable wrapper with accessible controls and parent-engine ownership.

## Implementation Notes

- Generator routes expose the report for sample publisher and MiniStar tenants.
- Reports show `prototype_mobile_accessibility_report`, `activity_compatibility_snapshot`, `template_rendering_profile`, `font_accessibility_profile`, and `standard_event_contract` references.
- Required checks include mobile viewport smoke evidence, touch target checks, keyboard and focus checks, readable text checks, visual stability checks, and mode-level failure triggers.
- Blocked actions include student-facing previews, direct app imports, route registry writes, accessibility waivers from visual polish, Phaser/canvas wrappers without accessible DOM controls, and assignment creation.
- MiniStar reports keep early Japanese support text hiragana-readable and unable to unlock English progress.

## Follow-Up

Add a backend-neutral storage contract for `prototype_mobile_accessibility_report` after this review surface is verified.
