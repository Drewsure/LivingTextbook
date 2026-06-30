# DR-018: Local Microphone Record/Replay

Status: Accepted

Decision: Add browser-local microphone record/replay as the first active microphone capability for speaking games, before transcript matching, pronunciation scoring, or AI Tutor feedback.

White-label impact: Strongly positive. Standard tenants get useful oral-practice support, while premium tenants can later add speech scoring through entitlement-controlled packages.

Cost impact: Positive. Native browser recording avoids immediate model calls, speech-service subscriptions, cloud audio storage, and moderation costs.

Privacy impact: Positive. Audio remains local to the browser tab as a temporary replay URL. The platform records metadata that practice occurred, not the raw recording.

Constraints:

- No microphone permission prompt on page load.
- `Record` is the only trigger for microphone permission.
- Recording, replaying, and clearing do not complete mastery by themselves.
- No raw audio upload or persistence by default.
- No transcript generation by default.
- No pronunciation score or AI Tutor feedback in the core slice.
- Target-language `I said it` remains the progress trigger.
- The decision is recorded in `docs/adr/0018-local-microphone-record-replay.md`.
