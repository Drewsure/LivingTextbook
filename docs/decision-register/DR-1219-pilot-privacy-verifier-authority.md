# DR-1219: Pilot Privacy Verifier Authority

Date: 2026-09-25  
Status: Accepted

The pilot rehearsal privacy verifier now reads raw learner audio and transcript
exclusion from the authoritative validated backup-manifest contract. It reads
the SQLite operations coordinator only for deployment policy behavior. This
removes a false source-location assumption without weakening the privacy
boundary or enabling durable writes.

Evidence: `scripts/verify-pilot-session-rehearsal.mjs`,
`apps/web/src/server/persistence/backupManifest.ts`, ADR 1219.
