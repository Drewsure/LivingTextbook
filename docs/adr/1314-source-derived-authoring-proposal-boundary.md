# ADR 1314: Source-Derived Authoring Proposal Boundary

## Status

Accepted for the first MiniStar pilot review path.

## Decision

When a real textbook source supplies vocabulary but not the two canonical
target sentence structures, the review workspace may show a clearly labelled
authoring proposal. For MiniStar Unit 1, the proposal contains `Stand up,
please.` and `Sit down, please.` because both are conservative command
sentences built from the extracted physical-action terms.

The proposal is platform-authored and must never be represented as extracted
source text. It remains review-only: it cannot create a teacher draft, student
payload, route, assignment, QR target, media playlist, local bundle, or release
package. Teacher approval, English audio, hiragana-only Japanese support,
media rights, accessibility, package integrity, and release evidence remain
independent gates.

## Consequences

- Teachers can evaluate concrete sentence candidates without inventing a live
  lesson through an untracked edit.
- The source checksum and review identity stay attached to the proposal.
- A later approved draft can reuse the proposal only after the reviewer records
  accepted wording and the required audio/media evidence.
- The current greetings rehearsal package remains separate from this proposal.
