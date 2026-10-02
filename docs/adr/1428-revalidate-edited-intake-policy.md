# ADR 1428: Revalidate Edited Intake Policy

## Decision

The publisher intake preflight independently validates target language,
support-language ids, delivery mode, hosted-persistence opt-in, and duplicate
support-language declarations after the generator has written the brief.

## Rationale

The intake folder is an external handoff and may be edited by a publisher or
operator. Generator validation alone cannot protect the review boundary after
that edit. Revalidation keeps the canonical source review from accepting a
malformed language or delivery policy.

## Safety boundary

Invalid or duplicate language ids, unsupported delivery modes, and hosted
persistence requested for closed-local delivery remain incomplete. The
preflight writes only create-once metadata evidence and never uploads, assembles,
prints, activates, or exposes student content.

## Verification

`node scripts/create-publisher-pilot-intake-kit.mjs --self-test`

`node scripts/verify-publisher-pilot-intake-kit.mjs`

`node scripts/publisher-pilot-intake-preflight.mjs --self-test`
