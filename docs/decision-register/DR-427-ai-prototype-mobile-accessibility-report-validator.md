# DR-427: AI Prototype Mobile Accessibility Report Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype mobile accessibility reports must use a shared content-model validator before Codex integration decisions, app patch planning, route planning, package promotion, assignment, accessibility waivers, or student-facing previews can be considered.

## Rationale

Returned prototypes must fit the real classroom path: teacher QR entry, young learner phone/tablet use, visible controls, tap-to-speak access, readable support text, and removable Phaser/canvas wrappers with accessible DOM control labels. A shared validator prevents polished prototypes from bypassing mobile layout, readable text, focus order, and child-friendly touch checks.

## Required Evidence

- Prototype mobile accessibility, integration plan, activity compatibility, template rendering profile, font accessibility profile, and standard event contract lineage.
- Mobile viewport smoke evidence for phone portrait, phone landscape, tablet, and classroom display widths.
- Child-friendly touch targets and separate submit/listen/replay/retry/next controls.
- Keyboard and focus checks following the learning sequence without traps.
- Readable text checks that reject hidden black-button text, negative letter spacing, viewport-scaled fonts, and unreadable support-language rendering.
- Phaser/canvas wrapper evidence for DOM controls when used.

## Hard Boundaries

- No student-facing preview from returned code.
- No direct import into `apps/web`.
- No route registry write.
- No accessibility waiver from visual polish alone.
- No Phaser wrapper without accessible DOM controls.
- No assignment creation.
