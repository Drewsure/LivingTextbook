# Pilot Human Evidence Packet

The first saleable pilot needs two human-owned decisions that cannot be
inferred from a sample tenant or a review preview:

- the selected delivery, privacy, retention, backup, cost, and identity policy;
- the named release decision, QR print authorization, rehearsal, rollback, and
  final checksums.

Keep this packet outside the `LivingTextbook` repository. The platform reads it
for audit only. It does not upload files, write a package, print QR codes,
activate persistence, or enable students.

## Folder Shape

```text
pilot-human-evidence/
  delivery-policy.json
  package-review-evidence.json
  release-authorization.json
```

Create the incomplete templates without overwriting existing records:

```powershell
npm run create:pilot-human-evidence -- `
  --root "D:\PublisherPilotReview\human-evidence" `
  --tenant-id "publisher-name" `
  --package-id "publisher-name-l1-u1-package" `
  --unit-key "series:book:L1:U1"
```

The generator intentionally writes `draft` status and `REPLACE_WITH_*`
placeholders. That output is not evidence until a named adult or policy owner
completes and reviews it. Existing records are never overwritten.

Run the validator before using the saleability audit:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm run verify:pilot-human-evidence -- `
  --root "D:\PublisherPilotReview\human-evidence" `
  --publisher-root "D:\PublisherPilotInput"
```

The records must describe the same tenant, package, unit, delivery mode, and
hosted-persistence choice. `delivery-policy.json` must have:

- `recordVersion: 1` and `status: "accepted"`;
- `tenantId`, `packageId`, and `unitKey`;
- `mode`: `hosted`, `closed-local`, or `hybrid`;
- `hostedPersistenceOptIn` as an explicit boolean;
- policy version, reviewer identity, approval timestamp, retention, backup,
  cost, rollback, and student-identity references.

`package-review-evidence.json` must have:

- `recordVersion: 1` and `status: "reviewed"`;
- the same tenant, package, and unit identity;
- a named review packet, reviewer, review timestamp, source inventory checksum,
  and package checksum;
- at least one curated game pathway;
- reviewed content, game, audio, video, image, font, accessibility, and rights
  lanes, with explicit evidence references; a lane may be `not-applicable` only
  when its evidence reference explains why;
- `promotionAllowed: false` and `studentFacingActivationAllowed: false`.

The package checksum must match the `package` checksum in the release record.
The source inventory checksum must match the durable publisher source preflight
when a publisher root is supplied to the audit.

Validate the package review record directly before the combined human packet
check:

```powershell
node scripts/verify-pilot-package-review-evidence.mjs `
  --path "D:\PublisherPilotReview\human-evidence\package-review-evidence.json"
```

When the tenant-scoped package evidence review has been recorded, derive the
external record instead of retyping its lane references or source checksum:

```powershell
node scripts/create-pilot-package-review-evidence-from-record.mjs `
  --source-preflight "D:\PublisherPilotInput\evidence\publisher-source-preflight.json" `
  --package-review "D:\PublisherPilotReview\package-evidence-review.json" `
  --output "D:\PublisherPilotReview\human-evidence\package-review-evidence.json" `
  --unit-key "series:book:L1:U1" `
  --package-checksum "sha256:<assembled-package-checksum>" `
  --game-pathway "flashcards" `
  --game-pathway "memory-match"
```

This bridge is create-once and metadata-only. It requires a complete source
preflight and a completed package-evidence review, and it never copies files,
assembles a package, prints QR codes, or activates students.

`release-authorization.json` must have:

- `recordVersion: 1` and `status: "approved"`;
- matching tenant, package, unit, mode, and hosted-persistence choice;
- named reviewer and approval timestamp;
- `qrPrintAuthorization: "approved"` and
  `studentUseAuthorization: "approved"`;
- browser-rehearsal and rollback evidence references;
- SHA-256 checksums for `source`, `package`, and `qr-print-artifact`.

Do not place bearer tokens, learner records, raw audio, transcripts, or source
files in this packet. It is decision metadata, not a delivery archive.

## Audit

With only platform evidence, the audit remains `waiting-human`:

```powershell
npm run audit:pilot -- --json
```

With the real publisher folder, isolated Z.ai candidate, and human packet:

```powershell
npm run audit:pilot -- --json `
  --publisher-root "D:\PublisherPilotInput" `
  --candidate-root "D:\LIVING TEXTBOOOK PROJECT\zai-review\memory-match-candidate" `
  --human-evidence-root "D:\PublisherPilotReview\human-evidence"
```

The Z.ai candidate path may be either the exact extracted candidate folder or
an outer extraction folder containing exactly one nested
`evidence/return-package.json`. The audit resolves that single candidate but
refuses to guess when multiple returned packages are present.

The audit can report `saleable-pilot-ready` only when the platform proof, real
publisher preflight, Z.ai evidence verifier, human packet, and every other
pilot gate all pass. A passing packet still does not perform release or
activation; the controlled operator procedure remains the final execution
boundary.
