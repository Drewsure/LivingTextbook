# ADR 0758: Teacher Report Target Language

## Status

Accepted

## Context

The teacher report runtime already validates tenant, launch, privacy, policy,
approval, and canonical game evidence. Its request and canonical evidence
helper still allowed target language to be omitted, which could make a
white-label report evaluate audio evidence without the learner language
contract.

## Decision

Require a non-empty `targetLanguage` on `TeacherReportRuntimeRequest` and on
the teacher-runtime canonical evidence helper. Keep the lower-level generic
report evidence parser reusable for inspection contexts that intentionally
provide an expected language separately.

## Consequences

Teacher report runtime validation cannot silently fall back to English or
accept language-free canonical evidence. This does not enable report export,
persistence, progression, assignment, rewards, or Phaser source promotion.

## Verification

Run `npm run verify:report-runtime`, `npm run verify:runtime-behavior`, the
web and AI-service typechecks, and the full foundation suite.
