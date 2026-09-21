# Build Session: Memory Match Accessibility State

## Goal

Harden the canonical pairing slice for keyboard and assistive-technology use.

## Change

Memory Match cards now expose revealed state through `aria-pressed`, hidden
cards identify their position and keyboard action, and changing feedback is a
polite live region. The pairing engine and all progression ownership remain
unchanged.

## Verification

- `npm run verify:canonical-games`
- Web typecheck
- Production build
