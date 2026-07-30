# DR-283: AI Generator Draft Payload Preview

Status: Accepted  
Date: 2026-07-31

Decision: Add a read-only Draft JSON preview to the teacher AI generator route.

White-label impact: Positive. Publishers can inspect the future generated package shape without relying on MiniStar assumptions or live AI behavior.

Cost impact: Positive. The preview uses static sample data and keeps model calls, copy, verifier submission, publishing, playlist creation, and assignment blocked until paid services and storage are intentionally selected.

Constraints:

- `target_language_progress_trigger` must remain target-language-only.
- `support_language_progress_allowed: false` must remain explicit.
- Unapproved target-language audio blocks student use.
- The preview must not imply live generation, live verifier submission, or production package creation.
- This decision is recorded in `docs/adr/0283-ai-generator-draft-payload-preview.md`.
