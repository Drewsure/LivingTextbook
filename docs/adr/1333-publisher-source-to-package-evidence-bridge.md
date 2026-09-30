# ADR 1333: Publisher Source-to-Package Evidence Bridge

## Status

Accepted for foundation hardening. Review-only.

## Decision

Bind a publisher's checksum-bound source review, extraction preview, extraction
packet, and platform-authored sentence proposal into one evidence bridge before
any teacher draft or package assembly is considered. The bridge is generic for
white-label tenants and is demonstrated with MiniStar Unit 1.

The bridge must expose separate lanes for source provenance, extraction, source
term review, sentence approval, target-language audio, multimedia rights, game
verification, and package release. It must distinguish missing human evidence
from platform-authored candidates and must remain side-effect-free.

## Consequences

- A real DOCX/PDF can be discussed as a concrete pilot candidate without being
  mistaken for an approved unit.
- Sentence candidates remain visibly platform-authored and cannot masquerade as
  extracted textbook text.
- Audio, rights, game replay, and release gaps stay visible in one handoff.
- The bridge adds no file writes, package promotion, QR output, persistence
  activation, or student access.

## Rejected shortcut

Do not infer readiness from a valid checksum, eight vocabulary terms, or a
complete-looking activity pathway. Human review and evidence remain separate
gates.
