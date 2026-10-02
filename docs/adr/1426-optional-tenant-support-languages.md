# ADR 1426: Optional Tenant Support Languages

## Decision

Make assist languages an explicit optional intake-kit choice. The generator
defaults to no support language and accepts a bounded comma-separated list such
as `ja,es` when a publisher or school approves it.

## Rationale

Japanese support is important for the MiniStar reference tenant, but a
white-label platform must not force Japanese or any other language onto every
publisher. Making the choice explicit also gives the teacher and school a
clear policy boundary for language, script, audio, and cost decisions.

## Safety boundary

Support-language identifiers are validated and deduplicated. Support text and
audio remain assistive only; target-language completion continues to control
progression and mastery. The intake change does not upload, activate,
assemble, print, or enable students.

## Verification

`node scripts/create-publisher-pilot-intake-kit.mjs --self-test`

`node scripts/verify-publisher-pilot-intake-kit.mjs`
