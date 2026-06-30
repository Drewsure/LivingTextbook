# DR-017: Core Speech Practice Shell

Status: Accepted

Decision: Build `Speak It` as a core audio-led speaking practice mode before premium AI speech matching.

White-label impact: Positive. Every tenant can offer speaking/listening practice without requiring AI Tutor, cloud speech services, or MiniStar-specific behavior.

Cost impact: Positive. The first route uses existing unit payloads, audio cues, event metadata, and local progression instead of introducing a speech backend.

Component boundary: Positive. The route uses the shared game-shell/progression pattern and can later be upgraded by optional speech matching without removing the core fallback.

Constraints:

- Target-language prompts drive the speaking task.
- Learners listen, speak, and tap `I said it` for core confirmation.
- Self-confirmation is not automatic pronunciation assessment.
- The mode must remain usable without premium AI Tutor.
- The decision is recorded in `docs/adr/0017-core-speech-matching-practice-shell.md`.
