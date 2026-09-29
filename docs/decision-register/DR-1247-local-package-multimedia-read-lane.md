# DR-1247: Local Package Multimedia Read Lane

- **Status:** Accepted
- **Decision:** Add a gated local package media endpoint and package-scoped
  playlist route that serve only approved media, poster, and transcript files
  declared by the content and local-bundle manifests.
- **Reason:** The pilot objective includes multimedia delivery. Recording media
  in a package without a bounded playback lane would leave the local handoff
  incomplete.
- **Boundary:** The lane is read-only. It cannot write packages, learner
  records, QR aliases, hosted persistence, or release state. Playback events
  remain browser rehearsal evidence until persistence and policy gates close.
- **Evidence required next:** Real publisher media files, rights and scan
  evidence, captions/transcripts, device playback rehearsal, and an approved
  offline/cache policy if offline delivery is promised.
- **References:** ADR 1247 and `verify-local-pilot-media-route.mjs`.
