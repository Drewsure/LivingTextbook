# DR-508: AI Draft Repair Evidence Packet

Status: Accepted

Decision: Draft correction queues must produce evidence-only repair packets before verifier submission can be considered.

Reason: Correction queues identify what is wrong, but reviewers also need a disciplined evidence packet that proves what was repaired before a draft can move toward verification. This blocks a common shortcut: treating AI auto-fix or live regeneration as enough.

White-label impact: Positive. Schools and publishers can require different evidence standards without changing the core generator architecture.

Cost impact: Positive. Auto-fix loops, live AI regeneration, and speech/voice costs remain blocked until adults approve package scope and storage policy.

Constraints:

- Repair evidence must link the draft preview and correction queue.
- Repair evidence must name schema validation, target-language audio, media-rights, and verifier-submission evidence.
- Repair evidence must keep target-language-only progress, support-language progress blocking, media-only progress blocking, auto-fix blocking, live AI regeneration blocking, and verifier-submission blocking visible.
- MiniStar Foundation repair evidence must keep Japanese support hiragana-only, support-only, and unable to unlock English progress.
