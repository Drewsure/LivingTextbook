# DR-1385: Local Assembly Requires Canonical Game Evidence

The local package writer now requires the immutable reviewed package-evidence
status and all three canonical platform-derived game evidence record IDs in its
review binding. The execution preflight reads the durable package evidence
review before producing an assembly input, and the runtime reader rejects
tampered or incomplete bindings.

This keeps the first saleable white-label pilot honest: an approved file and
release envelope is not a reviewed multimedia/game package. The evidence is
metadata-only and does not authorize release, QR printing, persistence,
student-facing activation, or learner-record storage.

Verification: `node scripts/verify-local-pilot-package-assembler-behavior.mjs`
and `npm run verify:foundation-composition`.
