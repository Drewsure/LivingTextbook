# ADR 0456: Activity Compatibility Audio And Reporting Lanes

Status: Accepted

Date: 2026-08-29

## Context

Activity compatibility records already include audio and reporting requirements, but the UI was only showing payload fit, target-language trigger, compatibility rule, and next step. That is not enough for game design, printable planning, or outside prototype review because an activity should never be considered compatible unless the learner-audio lane and teacher-reporting lane are visible.

## Decision

Show audio requirement and reporting requirement blocks for each activity pathway compatibility item.

## Consequences

- Teachers and reviewers can see why a pathway is valid, planned, premium, teacher-review, or blocked.
- Future Z.ai, Phaser, printable, and AI-generator requests must account for audio and reporting before integration review.
- Support-language taps, media-only activity, and unreported game completion remain unable to unlock progress or rewards.
