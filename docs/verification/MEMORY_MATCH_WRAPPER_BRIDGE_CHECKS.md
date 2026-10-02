# Memory Match Wrapper Bridge Checks

Run from the repository root after extracting a returned package outside the repository:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
$env:LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT = "D:\LIVING TEXTBOOOK PROJECT\zai-review\<returned-package-folder>"
node scripts/verify-phaser-candidate-package.mjs
node scripts/verify-memory-match-wrapper-evidence.mjs
node scripts/verify-memory-match-wrapper-bridge.mjs
```

The package verifier checks hashes and frozen provenance. The wrapper evidence check compares the returned fixture, event replay, audio map, scoring replay, wrapper notes, and accessibility evidence with the canonical platform contract. The bridge check confirms that the teacher workbench exposes the evidence as a blocked normalization bridge, names the canonical pairing route and scoring profile, preserves the frozen provenance, and does not authorize source import, route replacement, or student assignment.

The current 2026-10-02 package is expected to fail the wrapper evidence check until Z.ai returns the corrected replay and accessibility evidence described in `docs/agent-briefs/ZAI_MEMORY_MATCH_CORRECTED_EVIDENCE_REQUEST.md`.
