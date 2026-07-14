# DR-206: Template Rendering And Font Storage Contract

## Decision

Promote `template_rendering_profile` and `font_accessibility_profile` into first-class backend-neutral storage contracts before live cross-game upload rendering or tenant font controls are enabled.

## Rationale

The upload/content-entry panel is becoming a cross-game foundation, not a single screen. Without durable profile records, future teams could accidentally turn preview controls into live template switching, arbitrary styling, unlicensed font use, unreadable early learner text, or broken Japanese rendering.

## Implications

- `/teacher/intake` must expose template rendering and font accessibility records through the backend readiness panels.
- Hosted and local adapter plans must include write intents for both profile types.
- Durable records must preserve template rendering profiles and font accessibility profiles.
- Student-facing rendering stays blocked until compatibility, layout, media, language, font, license, release, and review gates pass.
- Teacher font upload remains blocked; tenant-approved font packs are configuration records, not free-form teacher styling.

## Next

When live authoring begins, build reviewed profile editing as an admin/tenant workflow before allowing teachers to assign rendered template variants to students.

