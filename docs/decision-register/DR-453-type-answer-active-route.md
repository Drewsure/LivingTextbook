# DR-453: Type Answer Active Route

Status: Accepted

Decision: Promote `type-answer` to a first-class active student route at `/type-answer/[code]`.

White-label impact: Positive. Type Answer is a reusable text-spelling mode for any tenant with reviewed vocabulary, target-language audio, and accepted-answer rules.

Cost impact: Positive. The mode reuses the content package, launch resolver, teacher assignment metadata, audio cue system, local progression adapter, and text-spelling route shell instead of creating a separate typing app.

Constraints:

- Use reviewed vocabulary terms only; do not create unreviewed spelling variants inside the game.
- Keep prompt audio, instructions, feedback, input label, and submit control audio-supported.
- Target-language typed answers drive events and mastery updates; support language remains support-only.
- Use deterministic scoring. No random rewards or pressure loops.
- Keep the UI structural until text-spelling behavior, route reporting, and package coverage are stable.
- Extend accepted-answer and segmentation rules before using this mode for Japanese target-language typing or non-space-delimited languages.

Verification:

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:game-modes`
- `npm.cmd run verify:package-readiness`
- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:activity-pathways`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:routes`
