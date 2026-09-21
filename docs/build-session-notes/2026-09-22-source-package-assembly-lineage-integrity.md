# Build Session: Source Package Assembly Lineage Integrity

## Goal

Make the reviewed PDF, DOCX, text, image, audio, and video candidate bridge
deterministic before it can participate in a future tenant package workflow.

## Change

The shared source-package assembly validator now requires SHA-256-shaped source
identity, unique candidate and evidence identifiers, and complete review
evidence for `draft-candidate` packets. Fixtures now use deterministic sample
hashes, and runtime/static verifiers cover invalid checksum, duplicate, and
incomplete-review cases.

## Boundary

This remains review-only. It does not add an upload action, create a draft,
promote extracted content, create playlists, publish media, assign students, or
integrate frozen Z.ai/Phaser source.

## Verification

- runtime behavior harness
- source review queue verifier
- foundation composition and content-model boundary checks
- web typecheck
- production build
- active route verification
