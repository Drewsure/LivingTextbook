# DR-849: Curated Unit Pathway Resolution

## Decision

Use the tenant-scoped curated unit game-offer map for the visible student and
teacher pathway whenever it exists. Use the shared catalog only as an
exhaustive structural fallback. Keep Training Academy as a distinct final
review lane.

## Rationale

This gives white-label tenants curriculum control without creating isolated
screen logic or a giant unreviewed template switcher.

## Boundaries

Pathway resolution does not publish content, assign students, write
persistence records, or promote external Phaser source.

## Verification

`npm run typecheck --workspace @living-textbook/web`

`npm run verify:routes`

`npm run verify:foundation`
