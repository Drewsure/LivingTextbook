# DR-440: AI Target-Language Audio Approval Packet Validator

## Status

Accepted.

## Context

Generated game packages need audio-first review before teacher approval, package assembly, route creation, playlist creation, assignment, or student-ready state. Young learners must be able to access target-language text through audio, while support-language audio remains support-only.

## Decision

Add a shared `validateAiTargetLanguageAudioApprovalPacket` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires audio cue manifest links, target-language approval records, required coverage categories, cue review evidence, blocked voice/API actions, media-only progress blocking, and support-language-only boundaries.

## Consequences

- Audio approval packets stay review-only until future approval capture exists.
- No audio approval capture, generated voice call, speech API billing, package audio-complete marker, route creation, playlist creation, student assignment, media-only progress, or support-language progress trigger is enabled.
- MiniStar Foundation/Bronze/Plus Japanese support remains hiragana-only and support-only while English remains the progress trigger.
