# ADR 0893: Memory Match Accessibility State

## Status

Accepted

## Decision

Use semantic button state and a polite live feedback region in the canonical
Memory Match wrapper. The existing pairing engine remains the only authority
for card selection, matching, attempts, completion, and progression events.

## Consequences

- Screen-reader and keyboard users receive state and result feedback that is
  independent of visual color and motion.
- The wrapper remains compatible with the white-label route and tenant audio
  contracts.
- No new persistence, scoring, or route behavior is introduced.

## Verification

Run `npm run verify:canonical-games`, web typecheck, and the production build.
