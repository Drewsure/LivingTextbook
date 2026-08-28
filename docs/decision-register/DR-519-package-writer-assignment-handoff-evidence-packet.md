# DR-519: Package Writer Assignment Handoff Evidence Packet

Status: Accepted

Decision: Add a review-only assignment handoff evidence packet after the assignment shell guard.

White-label impact: Positive. Tenant assignment policy, private-link policy, roster privacy, reporting, launch gates, rollback, and support-language boundaries become explicit before any generated package can move toward classroom assignment.

Cost impact: Positive. The platform avoids costly privacy, reporting, school-policy, and support failures by blocking assignment activation until the evidence bundle is complete.

Constraints:

- Assignment shell writes, private assignment link activation, class roster binding, progress event stream activation, teacher report export, live classroom launch, assignment activation from generated packages, raw learner audio/transcript storage, and support-language-only assignment handoff remain blocked.
- Required evidence includes assignment shell guard storage, teacher QR/front-door review, target-language trigger proof, private-link policy proof, no-real-learner-data proof, teacher report privacy proof, progress event taxonomy proof, classroom launch gate review, rollback evidence, and support-language boundary proof.
- MiniStar keeps English target-language progress and hiragana-only Japanese support.

ADR: `docs/adr/0448-package-writer-assignment-handoff-evidence-packet.md`
