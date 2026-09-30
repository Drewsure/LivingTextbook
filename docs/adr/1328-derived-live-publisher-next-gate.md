# ADR 1328: Derived Live Publisher Next Gate

Date: 2026-09-30  
Status: Accepted

## Decision

The live publisher review journey must derive its next-action summary from the
current gate statuses. It exposes stable `nextGateIds` in gate order and
gate-specific `nextGates` text. The first unresolved gate is therefore the
operator's next review target, whether it is open or blocked.

The summary is advisory review navigation. It cannot change a gate, assemble a
package, promote an asset, print a QR code, activate hosted persistence, or
start a student session.

## Consequences

- A real publisher handoff becomes easier to operate as evidence is completed.
- Source changes-required decisions correctly return the operator to source
  review instead of advancing to package work.
- Release/QR and teacher rehearsal remain visible as unresolved even after
  upstream review evidence passes.
- Automation can use stable gate IDs without parsing human text.

## Verification

`npm run verify:publisher-submission-live-review-journey` checks initial,
changes-required, and evidence-complete states, including their first
unresolved gate IDs and the blocked action flags.
