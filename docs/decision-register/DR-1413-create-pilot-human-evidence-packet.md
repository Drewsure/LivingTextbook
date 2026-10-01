# DR-1413: Create-Once Human Evidence Packet Generator

- **Decision:** Provide `npm run create:pilot-human-evidence` for external,
  incomplete delivery-policy and release-authorization templates.
- **Reason:** Reduce handoff errors without fabricating approval evidence.
- **Boundary:** External folder, create-once writes only; generated records stay
  draft and placeholder-filled until human completion and validation.
- **Verification:** `node --check scripts/create-pilot-human-evidence-packet.mjs`,
  `npm run verify:pilot-human-evidence -- --self-test`, and the publisher pilot
  intake verifier.
