# DR-838: Phaser Candidate Root Isolation

The Phaser candidate verifier must receive a package from an isolated folder
outside the `LivingTextbook` repository. It must resolve and check the return
manifest and every artifact as regular files inside that candidate root,
rejecting repository paths and symlink escapes before reading evidence.

This keeps the Z.ai handoff review-only and prevents an evidence packet from
accidentally becoming a source-import mechanism. It does not authorize source
promotion, route replacement, scoring mutation, audio-manifest mutation,
assignment, persistence, or student use. See ADR 0761.
