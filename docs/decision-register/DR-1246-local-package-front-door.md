# DR-1246: Local Package Front Door

- **Status:** Accepted
- **Decision:** Start each local package at a package-scoped, teacher-QR front
  door that reuses canonical target-language flashcards and unlocks the
  package-scoped Memory Match route.
- **Reason:** This is the smallest production-shaped journey that proves a
  publisher package can move from QR entry to audio-supported student
  progression without duplicating game logic or using sample routes.
- **Boundary:** Support language is assistive only. The route is read-only;
  learner records, package writes, hosted persistence activation, QR mutation,
  and release changes remain disabled.
- **Evidence required next:** Real publisher Unit 1 content, rights and
  accessibility evidence, printed QR/device rehearsal, rollback decision, and
  an approved persistence provider before saleable-pilot approval.
- **References:** ADR 1246 and `verify-local-pilot-front-door-route.mjs`.
