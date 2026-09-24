# DR-1144: Controlled Pilot Storage Policy Boundary

Decision: Preserve storage-selection review identity through controlled-pilot
approval readiness and the human-review packet.

- Carry the provider-neutral storage preflight and evidence-storage gate into
  the final review boundary.
- Keep storage selection explicitly blocked and reject scope drift.
- Keep approval capture, packet freeze, persistence writes, activation, export,
  QR mutation, release mutation, assignment, and classroom launch blocked.

References: ADR 1144, Build session 1058, and the controlled-pilot approval and
human-review verification gates.
