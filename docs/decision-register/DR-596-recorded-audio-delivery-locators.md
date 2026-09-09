# DR-596: Recorded Audio Delivery Locators

Status: Accepted

Decision: Require recorded, teacher-recorded, and partner-provided audio cues to identify a media asset or direct hosted/local delivery locator.

Guardrails:

- These cue sources require a media asset ID, `sourceUri`, or `localBundlePath`.
- Media asset references pass package, kind, tenant, and unit binding checks.
- Text-to-speech and fallback voice cues remain provider-neutral.
- Placeholder cues remain repair evidence only and cannot enter approved packages.

Recorded in `docs/adr/0525-recorded-audio-delivery-locators.md`.

