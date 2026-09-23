# ADR 1098: Media Source Resolution Safety

## Status

Accepted.

## Decision

The browser media resolver must validate delivery locators before handing a
source to an audio or video element. Hosted sources may be root-relative or
HTTPS URLs without embedded credentials. Local bundle sources must be safe
forward-slash relative paths with no protocol, backslash, traversal segment,
control character, or excessive length.

Resolution remains mode-aware: `hosted-first` prefers the reviewed hosted
locator, while `local-first` prefers the reviewed bundle path and may fall
back to a safe hosted locator. Invalid candidates are unavailable rather than
being passed to the browser.

## Rationale

Multimedia is a white-label tenant input surface. A reviewed asset record is
not permission to trust every string it carries at the final delivery edge.
Fail-closed source resolution protects audio/video elements, keeps local
companion paths contained, and preserves the hosted/local deployment choice
without conflating it with rights or release approval.

## Guardrails

- Source resolution does not approve rights, scans, uploads, or package
  promotion.
- Missing demo files remain visibly unavailable; no fake playback is claimed.
- Data, JavaScript, protocol-relative, credential-bearing, traversal, and
  oversized locators are rejected.
- Learning-audio priority and media-only progression rules remain owned by the
  higher-level package and game contracts.

See `apps/web/src/features/multimedia/mediaSourceResolver.ts` and
`scripts/verify-media-source-runtime.mjs`.
