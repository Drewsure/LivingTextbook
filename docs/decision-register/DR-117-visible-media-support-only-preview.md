# DR-117: Visible Media Support-Only Preview

## Decision

Media playlist demo controls must visibly describe emitted media events as support-only events.

## Reason

The event metadata now protects future storage and reports, but demos also need to make the product meaning visible. A teacher, publisher, or future agent should not infer that playing a song or video awards progress.

## Standard

- Playlist demo routes label media events as support-only.
- Event previews show no unlock, no mastery, and zero Star Dust semantics.
- Active route verification checks that playlist routes preserve the support-only wording.

