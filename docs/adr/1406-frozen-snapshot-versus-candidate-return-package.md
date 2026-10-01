# ADR 1406: Frozen Phaser Snapshot Is Not A Candidate Return Package

## Status

Accepted as the next external-builder handoff gate.

## Context

The frozen MiniStar Phaser snapshot proves source provenance and gives the
project useful reference material, but it does not contain the evidence
receipts required to judge a game against the Living Textbook contracts. A
frozen ZIP therefore cannot be copied into the repository or treated as an
integration candidate.

## Decision

Request a separate, isolated Memory Match candidate package from Z.ai using the
approved human handoff. The package must contain `evidence/return-package.json`
and the required source, fixture, event, audio, scoring, mobile, wrapper, and
README artifacts. Codex verifies the package before writing any integration
proposal.

## Consequences

The next human-side action is unambiguous. The platform can continue hardening
independently, while all outside game source remains removable and review-only.
The frozen snapshot remains valuable provenance but cannot satisfy the return
package gate by itself.
