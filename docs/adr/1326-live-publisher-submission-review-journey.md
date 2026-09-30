# ADR 1326: Live Publisher Submission Review Journey

Date: 2026-09-30  
Status: Accepted

## Decision

The authorized quarantine handoff must expose one live, tenant-bound review
journey derived from the submitted source and current metadata records. The
journey covers source admission, source decision, multimedia/game evidence,
package review packet, delivery mode, promotion adapter, release/QR review,
and teacher-led student rehearsal.

The journey is a read-only projection of existing review records. It does not
replace the individual evidence or release contracts, and it cannot assemble
files, promote assets, print QR codes, activate hosted persistence, or start
students.

## Consequences

- A real publisher submission has one understandable next-action sequence.
- Gate state remains derived from tenant, quarantine, package, and checksum
  identities instead of from a generic sample dashboard.
- Review completeness cannot be mistaken for production approval.
- The frozen Z.ai/Phaser source remains outside this live publisher path until
  its separate evidence return package is accepted.

## Verification

`npm run verify:publisher-submission-live-review-journey` validates the eight
gates, checksum identity, blocked actions, source-decision behavior, and
read-only panel boundary. The full foundation gate includes this verifier.
