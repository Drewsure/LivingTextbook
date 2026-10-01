# DR-1418: Checksum-Bound Publisher Preflight Evidence

- **Decision:** Require a durable, checksum-bound publisher intake preflight
  report before the first-pilot publisher-source gate can pass.
- **Reason:** A successful transient preflight or an old report cannot prove
  that the current external publisher brief and declared file inventory were
  reviewed.
- **Implementation:** `publisher-pilot-intake-preflight.mjs` writes
  `reportVersion` and `briefChecksumSha256`; `audit-first-saleable-pilot.mjs`
  validates the report against the current brief and protected review-only
  flags.
- **Human action:** After any publisher brief change, rerun the preflight with
  `--output evidence/publisher-intake-preflight.json` and preserve the new
  create-once report in the external handoff.
- **White-label impact:** Positive. Every tenant handoff has an auditable,
  tenant-neutral intake boundary without coupling the platform to a particular
  publisher or storage provider.
