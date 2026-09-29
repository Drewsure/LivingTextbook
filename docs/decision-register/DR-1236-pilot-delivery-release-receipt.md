# DR-1236: Pilot Delivery Release Receipt

- **Decision:** Add a manual release receipt after the pilot delivery manifest.
- **Goal:** Make the first white-label publisher handoff auditable before any
  package writer or student activation exists.
- **Scope:** Tenant, package, source checksum, reviewer identity and role,
  review timestamp, release approval, QR-print authorization, rollback
  reference, and blocked actions.
- **Current state:** Implemented as a side-effect-free blocked sample receipt.
- **Not allowed:** Package writes, QR mutation, local activation, hosted
  persistence activation, learner data, payload exposure, or support-language
  progression.
- **Next evidence:** A real publisher package, named authorized reviewer,
  accepted school/tenant policy, approved media and game audio, a custody
  snapshot, and a rollback reference before implementing a controlled writer.
