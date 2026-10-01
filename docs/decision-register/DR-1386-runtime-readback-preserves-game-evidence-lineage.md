# DR-1386: Runtime Read-Back Preserves Game Evidence Lineage

The verified local package runtime now carries the reviewed package-evidence
status and exact canonical game-derived record IDs into its bounded summary and
operator panel. The operator can audit the same game evidence after assembly;
the runtime still cannot expose publisher payloads, create routes, mutate QR
aliases, activate persistence, or start students.

Verification: `node scripts/verify-local-pilot-package-assembler-behavior.mjs`
and `npm run verify:foundation-composition`.
