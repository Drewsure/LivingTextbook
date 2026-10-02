# ADR 1431: Respect Optional Publisher Media During Intake

## Decision

Publisher intake preflight distinguishes required files from optional media
requests. Missing required source, learning audio, or evidence files remain
blocking. Optional image, video, transcript, font, and background-media files
that the publisher has not supplied are reported as omitted optional lanes and
do not make the source inventory incomplete by themselves.

## Rationale

White-label publishers must be able to submit a textbook unit with only the
media they own or want to use. Optional media should remain visible for review
without becoming an accidental delivery requirement. Learner-critical
target-language audio remains required.

## Safety boundary

An omitted optional lane is not approval. Rights, accessibility, package
mapping, playback, and release gates still apply if the publisher later adds
that asset. No preflight result enables upload, promotion, QR printing,
persistence, or student use.

## Verification

`node scripts/publisher-pilot-intake-preflight.mjs --self-test`

The self-test proves that required files can complete inventory while omitted
optional files are reported separately.
