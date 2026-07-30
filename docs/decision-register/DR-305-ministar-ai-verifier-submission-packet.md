# DR-305: MiniStar AI Verifier Submission Packet

Status: Accepted  
Date: 2026-07-31

Decision: Add a blocked, review-only AI verifier submission packet for the MiniStar Level 1 greetings generator request.

White-label impact: Positive. The verifier packet is tenant-scoped and uses shared packet concepts, so MiniStar proves the workflow without becoming the universal rule set.

Cost impact: Positive. The verifier packet is static review evidence only; it creates no live model call, speech scoring, voice generation, storage write, package approval, route, playlist, or assignment.

Constraints:

- English target-language events remain the only progress trigger.
- Japanese support is checked as hiragana-only and support-only.
- Target-language audio approval, media-rights evidence, and teacher approval remain blocked.
- No verifier submission, package approval, route creation, playlist creation, student assignment, or student-ready marker is enabled.
- This decision is recorded in `docs/adr/0305-ministar-ai-verifier-submission-packet.md`.
