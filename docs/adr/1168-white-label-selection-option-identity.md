# ADR 1168: White-Label Selection Option Identity

Status: Accepted

## Context

Tenant vocabulary may contain terms such as `ice cream`, `ice-cream`, and
`ice/cream`. Display slugs intentionally normalize punctuation, so slug-only
option IDs can collide inside one selection round.

## Decision

Keep the correct answer bound to its canonical ID and include deterministic
round and option position in every distractor ID. Labels and audio text remain
unchanged and continue to come from the reviewed tenant payload.

## Consequences

- Selection rounds remain structurally valid for white-label content.
- No hidden randomization or content mutation is introduced.
- The identity change is presentation/runtime bookkeeping only; scoring and
  progression remain platform-owned.

## Verification

- `npm run verify:selection-engine-runtime`
- `npm run verify:canonical-games`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
