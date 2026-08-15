# DR-455: Teacher Session Settings Review Packet

Date: 2026-08-15

## Decision

Add a review-only teacher session settings packet before any live setting save, launch-session persistence, student event storage, report export, microphone upload, AI Tutor activation, or support-language progress workflow can exist.

## Context

Teacher-controlled settings are becoming commercially important: assist language, microphone practice, background media, Training Academy recovery, report policy, and optional AI Tutor package cost all affect school trust. If these settings appear only as scattered copy, a future implementation could accidentally save incomplete settings, turn on a costly premium feature, or let support-language/media activity affect progress.

## Consequences

- `TeacherSessionSettingsReviewPacket` becomes part of the shared settings contract.
- `/teacher/intake` shows MiniStar and sample-publisher review packets as review-only artifacts.
- The packet must preserve learner-facing audio, target-language progression, support-language limits, hiragana-only early MiniStar Japanese support, microphone opt-in, raw-audio exclusion, background media priority, AI Tutor premium boundaries, and report/export policy gates.
- The packet explicitly blocks setting save, live classroom launch, student event storage, report export, raw microphone audio upload, AI Tutor activation, support-language progress, and background-media mastery.
- `npm run verify:session-settings` and active route checks must guard the packet markers.

## Follow-Up

When a hosted or local persistence adapter is selected, promote this packet into a durable launch-session settings review record before implementing real teacher setting saves.
