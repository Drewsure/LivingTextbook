# DR-1429: Align Human Delivery Evidence With Intake Modes

The human evidence generator now accepts `hosted-pwa`, `closed-local`, or `hybrid`, normalizes hosted PWA to the evidence contract's `hosted` mode, and preserves the explicit hosted-persistence opt-in in policy and release drafts. The validator rejects contradictory closed-local hosted opt-ins.

See ADR 1429 and `docs/PILOT_HUMAN_EVIDENCE_PACKET.md`.
