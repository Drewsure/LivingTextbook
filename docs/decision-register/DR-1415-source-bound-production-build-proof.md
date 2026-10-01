# DR-1415: Source-Bound Production Build Proof

The production-build saleability gate now requires a post-build proof file
whose source revision and Next build ID match the current repository. An old
`.next/BUILD_ID` cannot count as current platform evidence. The web workspace
writes the proof only after `next build --webpack` succeeds. See ADR 1415 and
`docs/adr/1415-source-bound-production-build-proof.md`.
