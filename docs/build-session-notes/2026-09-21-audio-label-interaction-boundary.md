# Build Session: Audio Label Interaction Boundary

## Goal

Remove interactive-content nesting from the canonical Type Answer input while
preserving tap-to-speak learning instructions.

## Change

The Type Answer instruction now lives in a separate labelled prompt container;
the input references it with `aria-labelledby`. The audio control is no longer
inside a native label element.

## Verification

- `npm run verify:canonical-games`
- Web typecheck
- Production build
- Full foundation gate
