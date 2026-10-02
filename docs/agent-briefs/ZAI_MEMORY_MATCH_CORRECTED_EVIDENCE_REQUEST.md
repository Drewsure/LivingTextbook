# Z.ai Memory Match Corrected Evidence Request

The first returned package is useful and hash-valid, but it is not admissible for a wrapper proposal yet. Return a new isolated evidence package only; do not ask Codex to import source or replace the canonical route.

## Required corrections

1. Keep the exact frozen source identity:
   - repository: `Drewsure/ministar-lab`
   - snapshot: `frozen-2026-09-12-aaa-stable`
   - commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
2. Use the platform scoring profile `pairing-reinforcement-v1` in both `evidence/event-replay.json` and `evidence/scoring-replay.json`.
3. Add `parentEngine: "pairing"` to `mastery_updated` and `game_completed` metadata.
4. Preserve the platform-owned event order, replay identity, target-language audio requests, and Memory Match Star Dust cap of 200.
5. Resolve the documented accessibility gaps: keyboard card navigation, visible focus state, reduced-motion behavior, and readable small-screen labels. Update `evidence/accessibility.md` with evidence of the implemented behavior, not only a plan.
6. Keep the package `review-only`, with all import, route replacement, scoring mutation, audio manifest mutation, promotion, and student assignment actions blocked.

## Return format

Return a new folder containing exactly the existing eight evidence lanes and `evidence/return-package.json`. Do not return only a frozen repository ZIP. The folder must pass:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
$env:LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT = "D:\LIVING TEXTBOOOK PROJECT\zai-review\<new-return-folder>"
node scripts/verify-phaser-candidate-package.mjs
node scripts/verify-memory-match-wrapper-evidence.mjs
```

The second command is the canonical wrapper bridge check. A passing result still requires a separate Codex integration decision; it does not authorize source import or promotion.
