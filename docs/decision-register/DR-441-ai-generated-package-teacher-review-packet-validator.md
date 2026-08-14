# DR-441: AI Generated Package Teacher Review Packet Validator

## Status

Accepted.

## Context

Generated packages need one teacher-facing review packet before approval capture, package assembly, route creation, playlist creation, assignment, or student-ready state can exist. The packet must keep content fit, target-language audio, activity pathway, deterministic rewards, media evidence, verifier readiness, and missing records visible without turning the preview into a live approval workflow.

## Decision

Add a shared `validateAiGeneratedPackageTeacherReviewPacket` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires decision-lane topics, teacher questions, ready signals, missing evidence, next records, target-language audio approval, media-rights evidence, release-control binding, assignment rollout, and blocked package actions.

## Consequences

- Teacher review packets stay review-only until future approval capture exists.
- No teacher approval capture, package assembly, route creation, playlist creation, assignment creation, local bundle write, student-ready marker, or support-language progress trigger is enabled.
- MiniStar teacher review packets preserve English target-language audio as the approval trigger and keep Foundation Japanese support hiragana-only and support-only.
