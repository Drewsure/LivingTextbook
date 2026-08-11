# DR-385: Target-Language Audio Approval Storage Contract

Date: 2026-08-11

Status: Accepted

## Decision

Add backend-neutral storage coverage for target-language audio approvals before any real audio approval, generated voice, speech API billing, package audio-complete marker, route creation, playlist creation, assignment, media-only progress, or support-language progress workflow can exist.

## Rationale

Target-language audio is a high-leverage platform surface: it touches young learner accessibility, teacher approval, tenant branding, white-label localization, and paid AI voice/speech costs.

The approval packet must therefore be durable and verifiable before it becomes a live workflow.

## White-Label Impact

Positive. The record keeps target language, assist language, and audio rules tenant-configurable instead of MiniStar-specific.

MiniStar can still enforce English as the trigger and hiragana-only Japanese support for early levels through tenant policy.

## Cost Impact

Positive. Voice generation, speech API billing, and package audio-complete states remain blocked until the school or tenant explicitly buys and approves that package.

## Blocked Actions

- Audio approval capture.
- Generated voice calls.
- Speech API billing.
- Package audio-complete markers.
- Route registry writes.
- Media playlist writes.
- Student assignment writes.
- Media-only mastery.
- Support-language progress triggers.

## Verification

- `npm.cmd run verify:backend-storage`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

## Follow-Up

Design real audio approval only after identity, policy, evidence attachments, media storage, and tenant cost controls are accepted.
