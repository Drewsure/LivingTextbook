# DR-803: Phaser Review Payload-Shape Hardening

Treat Phaser contract-review handoffs as untrusted JSON. Missing or malformed
evidence arrays, null collection entries, and missing nested approval blockers
must fail closed with actionable validation errors rather than throwing. This
protects review tooling from partial handoffs without authorizing source
import, route activation, scoring, persistence, package promotion, or student
assignment. See ADR 0729.
