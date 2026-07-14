# ADR 0206: Template Rendering And Font Storage Contract

Date: 2026-07-14

## Status

Accepted

## Context

The content-entry upload guide now treats Flip Tiles as a concrete source template whose row model can inform compatible games and printables. The same foundation also introduces approved learner fonts, tenant font packs, hiragana/furigana-safe rendering, tile sizing, and readability controls.

Those choices cannot remain only UI copy. Cross-game upload rendering and font controls need durable, backend-neutral records before live authoring, printable rendering, local companion packages, or tenant branding controls can rely on them.

## Decision

Add `template_rendering_profile` and `font_accessibility_profile` as backend-neutral storage contracts.

Both records must exist in the schema draft, migration candidates, migration specs, persistence adapter plans, durable record map, backend storage verifier, and teacher intake readiness route.

## Consequences

Future live authoring can reuse Flip Tiles-style row/upload patterns only through reviewed template rendering profiles. The platform avoids a risky switch-to-anything promise while still preserving curated cross-game reuse.

Future font controls can support white-label tenant branding and language-specific learner readability only through reviewed font accessibility profiles. Arbitrary teacher font uploads, unlicensed fonts, unsafe tile overflow, and broken hiragana/furigana rendering remain blocked.

