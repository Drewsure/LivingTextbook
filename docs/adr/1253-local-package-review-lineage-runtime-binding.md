# ADR 1253: Local Package Review Lineage Runtime Binding

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Persist the exact quarantine package review identity inside
  each assembled local package and require the local runtime reader to verify
  it before exposing package routes, content, or media.
- **Allowed:** Immutable package metadata may carry tenant, quarantine, packet,
  package, and source-checksum identity alongside the approved delivery
  records.
- **Blocked:** A missing or drifted review binding cannot be repaired or
  ignored by the runtime, and cannot be replaced by a release receipt alone.
- **Reason:** A saleable closed-local package must remain traceable to the
  publisher submission that was reviewed. The lineage must survive packaging,
  copying, and offline runtime use.
- **Exit evidence:** Assembly and runtime verifiers, typecheck, production
  build, and full foundation suite pass. Real publisher assets and release
  evidence remain required for pilot approval.
