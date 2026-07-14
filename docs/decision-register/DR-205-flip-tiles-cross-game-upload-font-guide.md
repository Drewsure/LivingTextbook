# DR-205: Flip Tiles Cross-Game Upload And Font Guide

## Decision

Use Flip Tiles as the source template for the current upload-panel reference, but promote the pattern into a cross-game upload guide with approved font and rendering controls.

## Rationale

The upload panel is useful beyond Flip Tiles. It can guide many compatible activities if the platform preserves compatibility checks, rights review, audio coverage, and layout safety. Fonts also need early governance because they affect child readability, Japanese support, white-label branding, tile layout, and printability.

## Implications

- `/teacher/intake` shows `Flip Tiles source template`, `Cross-game upload guide`, and approved font/rendering controls.
- `/teacher/authoring/draft-sample-publisher-l1-u1` shows the same concepts in the disabled draft workbench preview.
- Tenant font packs must pass readability, licensing, accessibility, multilingual rendering, and template-layout review.
- Arbitrary teacher font uploads remain blocked.
- Cross-game reuse still requires compatibility checks and cannot become a switch-to-anything shortcut.

## Next

When live authoring begins, add storage for `template_rendering_profile` and `font_accessibility_profile` before enabling tenant font packs or game-specific rendering controls.
