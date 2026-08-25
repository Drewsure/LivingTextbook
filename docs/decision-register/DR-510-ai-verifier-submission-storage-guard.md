# DR-510: AI Verifier Submission Storage Guard

Status: Accepted

Decision: AI verifier submission packets must be followed by a review-only storage guard before any live verifier workflow can be considered.

Reason: A valid verifier packet is not enough. The platform also needs durable tenant-scoped storage, reviewer identity, evidence attachment handling, retention policy, audit trail, audio approval, media-rights evidence, approval ledger, and release-control binding before verification can become a real workflow.

White-label impact: Positive. The guard keeps hosted and local companion adapters equivalent, which protects white-label customers that need either cloud delivery or closed local deployment.

Cost impact: Positive. Live verifier calls, package approval, route writes, playlist writes, assignments, and student-ready markers remain blocked until cost, storage, and review obligations are accepted.

Constraints:

- The backend-neutral record is `teacher_draft_verifier_submission`.
- Hosted and local companion adapter requirements must both be visible.
- Support-language progress remains blocked.
- MiniStar verifier storage guards must preserve English as target-language trigger and hiragana-only Japanese support for Foundation/Bronze/Plus.
