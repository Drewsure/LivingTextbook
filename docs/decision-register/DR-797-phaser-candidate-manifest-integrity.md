# DR-797: Phaser Candidate Manifest Integrity

The shared Phaser candidate profile manifest is now validated before package
review. It must contain unique target modes, supported parent engines, labels,
and at least four unique non-blank deterministic scoring scenarios per profile.
Malformed configuration fails closed and cannot silently weaken the evidence
gate. This remains review configuration only and does not authorize source
import, route replacement, package promotion, or student assignment. See ADR
0723.
