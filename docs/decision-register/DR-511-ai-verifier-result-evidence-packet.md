# DR-511: AI Verifier Result Evidence Packet

Status: Accepted

Decision: Verifier storage guards must be followed by an offline, review-only verifier result evidence packet before teacher approval prep can rely on verifier outcomes.

Reason: A verifier packet and storage guard show what is needed to submit. The platform also needs a stable shape for the result evidence that comes back, even before live verifier calls exist. This prevents a future shortcut where a draft is treated as approved because a verifier panel exists.

White-label impact: Positive. The result packet is provider-neutral and tenant-neutral while supporting tenant-specific requirements.

Cost impact: Positive. Live verifier calls, pass/fail finalization, package approval, route writes, playlists, assignments, and student-ready markers remain blocked until the tenant accepts cost, storage, evidence, and release rules.

Constraints:

- Result evidence must remain `offline-review-preview`.
- Result state must remain `verifier-result-not-submitted`.
- Result evidence must link verifier packet, verifier storage, repair evidence, schema, pedagogy, audio, rights, compatibility, and gamification records.
- MiniStar result evidence must preserve English target-language trigger and hiragana-only Japanese support.
