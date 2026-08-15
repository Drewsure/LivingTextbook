# DR-452: True Or False Active Route

Status: Accepted

Decision: Promote `true-false` to a first-class active student route at `/true-false/[code]`.

White-label impact: Positive. True/False is a familiar, low-cost teacher activity that can be offered to MiniStar and partner tenants without building an unrestricted switch-template panel.

Cost impact: Positive. The mode reuses the selection parent engine, existing scoring profile, launch resolver, audio support plan, activity hub, assignment metadata, and route verification.

Constraints:

- Use reviewed vocabulary terms only; do not generate unreviewed distractors inside the game.
- Keep prompt words, visible cards, instructions, feedback, and controls audio-supported.
- Target-language choices drive events and mastery updates; support language and media remain support-only.
- Use deterministic match/mismatch rounds and deterministic scoring.
- Keep the UI structural until parent-engine behavior, route reporting, and package coverage are stable.

Verification:

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:game-modes`
- `npm.cmd run verify:package-readiness`
- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:activity-pathways`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:routes`
