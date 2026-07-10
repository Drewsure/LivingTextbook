# DR-116: Media Events Support-Only Metadata

## Decision

Media playback and background media events must explicitly report that they cannot unlock progression, cannot award mastery credit, and award zero Star Dust.

## Reason

Media is core to the Living Textbook product, but media engagement is support context, not proof of vocabulary, syntax, speaking, or mastery. The support-only rule should travel with the event data so teacher reports and future storage cannot misinterpret playback as achievement.

## Standard

- `media_started`, `media_paused`, and `media_completed` events include support-only metadata.
- `background_media_enabled` and `background_media_disabled` events include support-only metadata.
- Background media events also state that learning audio priority is required.
- Teacher reports may count media engagement separately, but cannot use it as a progress gate.

