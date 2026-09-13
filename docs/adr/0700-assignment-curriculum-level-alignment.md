# ADR 0700: Assignment Curriculum-Level Alignment

## Status

Accepted

## Context

The content-model game catalog defines supported curriculum levels for each
canonical mode. Unit offer maps already validate that boundary, but teacher
assignment plans did not declare a level and could still list a future-level
mode such as Sentence Builder in a Level 1 assignment.

## Decision

Add a required `curriculumLevel` to `TeacherAssignmentPlan` and validate every
target mode against the shared game-mode contract. Sample assignments must use
the same Level 1 reviewed pathway as the offer map; Sentence Builder remains a
later-level option until its Level 2+ package is reviewed.

## Consequences

- Assignment planning, student offers, and teacher reporting share a level gate.
- Unsupported modes fail validation before private-link or QR workflows exist.
- Future Level 2+ assignments can use Sentence Builder by declaring a supported level.
- The assignment runtime remains review-only until persistence and live rollout
  providers are approved.

## Verification

- `npm run verify:assignment-rollout`
- `npm run verify:assignment-runtime`
- `npm run verify:runtime-behavior`
- `npm run typecheck --workspace @living-textbook/web`
