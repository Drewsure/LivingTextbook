# DR-1238: Canonical Publisher Package Index

- **Decision:** Make the publisher package index a public content-model
  contract and show it in the evidence handoff workspace.
- **Purpose:** Give a white-label publisher one inspectable map from reviewed
  textbook content to curated games, media, QR aliases, local fallback, and
  persistence choice.
- **Safety boundary:** Review-only indexes may be previewed, but written
  indexes require an approved manifest and manual release receipt. No payload
  bytes, learner records, route mutation, or student activation is included.
- **Verification:** Shared schema validation plus delivery-writer read-back
  binding must pass before a handoff is treated as present.
- **Next evidence:** A real publisher Unit 1 package must populate the index
  with final content, rights, media, game, QR, and selected delivery evidence.
