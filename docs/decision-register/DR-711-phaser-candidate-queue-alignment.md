# DR-711: Phaser Candidate Queue Alignment

**Status:** Accepted

Align the tenant-scoped prototype intake queue with the accepted Phaser review
order by adding `intake-ministar-memory-match-phaser` as the first `now`
candidate. It remains `awaiting-evidence` and review-only.

The queue record preserves the evidence requirements and blocked actions needed
to compare the frozen scene with the canonical Memory Match contract. Queue
presence does not authorize import, route replacement, scoring, persistence,
package promotion, or assignment.

Related ADR: `docs/adr/0639-phaser-candidate-queue-alignment.md`.
