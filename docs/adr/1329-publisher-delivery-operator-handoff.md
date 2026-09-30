# ADR 1329: Publisher Delivery Operator Handoff

## Decision

The live publisher quarantine handoff will expose one derived, tenant-bound
operator sequence for the first saleable pilot. The sequence covers source and
content review, review-packet capture, delivery and adapter selection,
release/QR authorization, package assembly with integrity readback, and
teacher-led rehearsal.

## Boundary

This is a review-only projection. It cannot write package files, issue a
release receipt, print QR codes, activate hosted persistence, or assign
students. Each protected action remains a separate gate and is displayed as a
blocked action in the handoff.

## Rationale

The pilot already has separate contracts and APIs for each evidence lane. A
single derived sequence makes the workflow usable without inventing a second
source of truth or prematurely creating a generic publish button.
