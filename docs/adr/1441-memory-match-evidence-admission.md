# ADR 1441: Admit Memory Match Evidence For Wrapper Review

## Status

Accepted for review-only wrapper planning. Not approved for source import or production promotion.

## Context

The isolated Memory Match package from `Drewsure/ministar-lab` passes the
canonical Phaser candidate verifier and remains outside the LivingTextbook
repository.

The candidate work was produced at commit
`c343e12e5bb82b7c3012c9afdf9310881741406d` on `main`, tagged
`memory-match-candidate-v4-2026-10-02`. The later `main` HEAD,
`1a1726c95e801cfebba81e7c66ca6d0ab3c2fc53`, is an auto-save commit that did
not change the eight evidence artifacts. The returned ZIP SHA-256 is
`352b882affdf7a0aef901039b8dcd5cc4023399a6131e23d821537bf3978599b`.

## Decision

Admit the package as a provenance-bound, hash-verified evidence candidate for
the next wrapper design step. Treat
`c343e12e5bb82b7c3012c9afdf9310881741406d` as the candidate work commit and
`1a1726c95e801cfebba81e7c66ca6d0ab3c2fc53` as the current branch head only.

The platform retains ownership of canonical scoring, mastery, Star Dust,
rewards, persistence, reporting, audio policy, and tenant identity. The
Phaser scene may provide interaction facts only.

## Explicit hold points

- Do not copy the candidate into `apps/web` or `apps/ai-service`.
- Do not replace an active route.
- Do not assign the candidate to students.
- Do not promote the package or treat verifier success as release approval.
- Resolve keyboard navigation, focus management, and reduced-motion behavior
  during wrapper implementation review before any promotion decision.

## Evidence

- Candidate folder:
  `D:\LIVING TEXTBOOOK PROJECT\zai-review\memory-match-candidate-2026-10-02-return-5\memory-match-candidate-2026-10-02`
- Verifier result: `PASS Memory Match package is hash-verified, frozen-source-bound, and remains review-only.`
- Frozen source commit:
  `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
- Z.ai branch: `main`
- Z.ai candidate commit:
  `c343e12e5bb82b7c3012c9afdf9310881741406d`
- Current upstream head:
  `1a1726c95e801cfebba81e7c66ca6d0ab3c2fc53` (autosave only)

## Consequences

The next engineering step may define a platform-owned Memory Match wrapper
adapter and test harness, but it must consume the reviewed contract rather
than import the Phaser scene directly. A separate integration decision is
required before any source retrieval, route wiring, or student-facing launch.
