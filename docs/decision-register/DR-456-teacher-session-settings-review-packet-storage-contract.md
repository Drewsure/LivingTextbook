# DR-456: Teacher Session Settings Review Packet Storage Contract

Date: 2026-08-15

## Decision

Teacher session settings review packets must be preserved with launch-session storage records and adapter write intents before any teacher setting save, live classroom launch, student event storage, report export, raw microphone upload, or support-language progress workflow can exist.

## Rationale

The settings review packet is the visible evidence that teacher/admin users saw learner audio rules, target-language progression rules, assist-language limits, microphone opt-in, background-media priority, optional paid AI Tutor cost policy, report policy, persistence warnings, blocked actions, and required-before-pilot records.

Keeping the packet inside the launch-session storage path is cheaper and cleaner than creating a separate storage family. It also keeps hosted and local white-label deployments aligned.

## Consequences

- Launch-session durable records now preserve `TeacherSessionSettingsReviewPacket`.
- Hosted and local persistence adapter write intents must preserve the settings review packet.
- Backend schema drafts and migration specs include `settings_review_packet`.
- The backend storage verifier fails if the review packet disappears from the storage plan.
- Support language remains support-only; it cannot unlock progress through settings storage.

## Non-Goals

- No production backend is selected.
- No live setting save is enabled.
- No student event storage is enabled.
- No raw microphone audio or transcript storage is enabled.
