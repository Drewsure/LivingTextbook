# ADR 0207: Template And Font Profile Readiness Panel

Date: 2026-07-14

## Status

Accepted

## Context

The platform now has backend-neutral storage contracts for `template_rendering_profile` and `font_accessibility_profile`. Those contracts are necessary, but teachers and administrators also need a visible readiness layer that explains why live template switching, printable rendering, tenant font packs, and font uploads remain blocked.

## Decision

Add a preview-only `TemplateRenderingFontProfilePanel` to `/teacher/intake`.

The panel shows the current Flip Tiles cross-game rendering profile and a young learner/Japanese-safe font profile. It names compatible families, row shape policy, media slot policy, layout constraints, tenant font pack rules, language rendering rules, readability checks, required records, and review gates.

## Consequences

The upload/content-entry foundation is easier to inspect without enabling live behavior. Student-facing rendering and font use remain blocked until reviewed profiles, compatibility checks, language rendering review, font licensing, printable renderer checks, and release gates pass.

