# DR-207: Template And Font Profile Readiness Panel

## Decision

Expose template rendering and font accessibility readiness as a visible teacher/admin panel on `/teacher/intake`.

## Rationale

Backend contracts alone are not enough. Future implementers need to see what is blocked before live authoring: cross-game rendering, printable output, tenant font packs, arbitrary font upload, and Japanese-safe rendering.

## Implications

- `/teacher/intake` shows `Template and font profile readiness`.
- The panel keeps `Student-facing rendering blocked` and `Student-facing font blocked` visible.
- The upload verifier and active route verifier both check the panel.
- The panel remains preview-only until reviewed profiles and release gates exist.

## Next

When live authoring begins, build admin-only reviewed profile editing before any teacher-facing template switching or font configuration.

