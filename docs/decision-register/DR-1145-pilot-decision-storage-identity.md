# DR-1145: Pilot Decision Storage Identity

Decision: Preserve exact provider-neutral storage-selection identity through
the canonical pilot review decision and white-label release-readiness record.

- Require the storage preflight ID and evidence-storage gate ID.
- Require storage selection status to remain `blocked` and allowed to remain
  `false`.
- Keep generic evidence bindings in addition to explicit storage identity;
  neither is permission to choose a provider or activate persistence.

References: ADR 1145, Build session 1059, pilot decision verification,
white-label release-readiness verification, and the controlled-pilot storage
policy boundary in DR-1144.
