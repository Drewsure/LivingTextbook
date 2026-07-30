# DR-298: AI Reward Readiness Gate Storage Contract

Status: Accepted  
Date: 2026-07-31

Decision: Add `ai_reward_readiness_gate` / `ai-reward-readiness-gate` to the backend-neutral storage contract.

White-label impact: Strongly positive. Reward readiness becomes a shared tenant-safe record instead of a MiniStar-only UI assumption.

Cost impact: Positive. The record blocks costly or risky downstream work until generated reward mappings are valid, reviewed, and tied to approved package/release policy.

Constraints:

- Preserve Star Dust cap checks, mastery threshold checks, deterministic unlock checks, accepted event source checks, and AI draft correction queue clearance.
- Block reward publishing, collection inventory writes, generated surprise rewards, Spin Wheel ticket issuance, avatar evolution writes, and student assignment.
- Hosted and local adapter plans must both preserve the same record semantics.
- This decision is recorded in `docs/adr/0298-ai-reward-readiness-gate-storage-contract.md`.
