# Z.ai Memory Match Human Handoff

This runbook is the human-side procedure for returning a Memory Match Phaser
evidence package from `Drewsure/ministar-lab`. The frozen snapshot is retained
as provenance, but it is not an integration candidate by itself.

## Required return

Z.ai must return a separate candidate folder or ZIP containing:

`evidence/return-package.json`

The package must remain outside the `LivingTextbook` repository until the
canonical verifier passes. Do not copy Phaser source into `apps/web` or
`apps/ai-service`.

## Procedure

1. Ask Z.ai to work only in `Drewsure/ministar-lab` on a named branch.
2. Give Z.ai `docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md` as the
   governing brief.
3. Require the complete eight-artifact return package, not only the frozen ZIP.
4. Download the returned ZIP into `Downloads` and extract it under
   `D:\LIVING TEXTBOOOK PROJECT\zai-review\`.
5. From PowerShell, run:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
& .\scripts\verify-zai-memory-match-package.ps1 -PackageRoot "D:\LIVING TEXTBOOOK PROJECT\zai-review\memory-match-candidate-2026-09-25"
```

The helper can also receive the outer extraction folder. If it finds exactly
one nested `evidence/return-package.json`, it resolves the candidate root for
you. It rejects placeholders, frozen snapshots, candidates inside
`LivingTextbook`, missing manifests, and ambiguous extraction folders.

## Human handoff back to Codex

Send the Z.ai branch and commit, the exact extracted folder, and the complete
verifier output. A failed check is useful evidence; do not repair the package
inside `LivingTextbook` or bypass the verifier.

## Boundary

A passing package is still review-only. It does not authorize source import,
route replacement, scene-owned scoring, persistence ownership, student
assignment, or production promotion. Codex must complete provenance, wrapper,
content, audio, scoring, privacy, accessibility, tenant, and integration
review before any adapter work begins.
