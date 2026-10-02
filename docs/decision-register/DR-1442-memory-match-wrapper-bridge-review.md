# DR-1442: Memory Match Wrapper Bridge Review

- **Decision:** Record returned Z.ai Memory Match evidence through a blocked, platform-owned wrapper bridge.
- **Why:** The package is structurally valid and useful, but its event/scoring evidence is not yet the canonical platform contract.
- **Canonical surface:** `PairingMemoryMatchGame` at `/memory/[code]`.
- **Blocked:** Direct Phaser import, route replacement, scene-owned scoring or persistence, package promotion, QR activation, and student assignment.
- **Next review:** Corrected `pairing-reinforcement-v1` replay, canonical parent-engine metadata, and accessibility remediation evidence.
- **Operational check:** `node scripts/verify-memory-match-wrapper-evidence.mjs` reads only the isolated candidate root and fails closed without writing or importing files.

Related ADR: `docs/adr/1442-memory-match-wrapper-bridge-review.md`.
