# Build Session: Phaser Source Identity Record

## Delivered

- Added required `sourceCommitSha` provenance to the Phaser candidate review
  content contract.
- Added hashed repository-relative source-file manifests for the reviewed
  scene, base engine, shared types, and audio evidence.
- Recorded the frozen MiniStar commit SHA on Memory Match and Balloon Pop
  review packets.
- Exposed the SHA in the teacher review-only panel.
- Extended the candidate review verifier and canonical integration standard.
- Updated the foundation-to-Z.ai intake gate so returned packages must carry
  the same immutable commit and file-hash evidence.
- Kept all external source outside `apps/web` and `apps/ai-service`.

## Boundary

The commit SHA establishes reproducible evidence for the frozen source. It is
not an import approval, wrapper approval, route activation, scoring decision,
or student assignment permission.

## Verification target

Run `npm run verify:phaser-candidate-reviews`,
`npm run verify:canonical-games`, the web typecheck, and the full
`npm run verify:foundation` gate before accepting a returned external game
package.
