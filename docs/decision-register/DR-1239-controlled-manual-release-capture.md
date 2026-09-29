# DR-1239: Controlled Manual Release Capture

- **Decision:** Add a gated adult operator route for manual release receipt
  capture and handoff to the existing metadata writer.
- **Purpose:** Give a real publisher pilot a controlled path from approved
  evidence to an auditable delivery decision without conflating approval with
  payload assembly or student activation.
- **Required controls:** Delivery token, explicit release flag, manifest and
  receipt validation, reviewer identity and role, review timestamp, rollback
  reference, bounded operator identity, and immutable conflict handling.
- **Current state:** Implemented but disabled by default. No sample package is
  release-ready, and no live student data can be activated by this route.
- **Next evidence:** A real Unit 1 package with closed rights, media, game,
  QR, policy, and deployment gates, followed by an authorized release rehearsal.
