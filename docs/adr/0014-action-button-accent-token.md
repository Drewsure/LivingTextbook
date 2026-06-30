# ADR 0014: Action Button Accent Token

Status: Accepted

Date: 2026-07-01

## Context

The MiniStar tenant uses a very dark `primary` brand token. That is acceptable for structural brand areas, headings, and strong identity marks, but it made learner action buttons look black and visually heavy in the classroom flow.

Young learners need primary actions such as `Mark practice complete` and `Start Memory Match` to be obvious, readable, and inviting.

## Decision

Shared primary action buttons use the tenant `accent` token, not the tenant `primary` token.

The `primary` token remains available for brand structure. The `accent` token is the default for learner-facing primary actions and important classroom calls to action.

The shared button primitive also uses inline CSS variable fallbacks for background, border, and text colors. This protects button readability if Tailwind arbitrary variable classes are not generated as expected inside shared packages.

## Consequences

Positive:

- MiniStar action buttons are blue instead of black.
- Future white-label tenants can keep dark brand colors without making child-facing actions hard to see.
- The action color rule is centralized in `packages/ui` instead of patched in one screen.

Tradeoffs:

- Tenants now need a deliberate accent color, not only a primary brand color.
- Visual verification remains required because color tokens are a real UX dependency, not a typecheck-only concern.

## Verification

After pulling this change, check `/launch/demo-unit-1` and confirm:

- `Mark practice complete` is visible and blue.
- After completing flashcards, `Start Memory Match` is visible and blue.
- Disabled secondary actions remain readable.
