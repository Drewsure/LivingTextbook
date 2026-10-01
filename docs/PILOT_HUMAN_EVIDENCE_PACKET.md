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

The audit can report `saleable-pilot-ready` only when the platform proof, real
publisher preflight, Z.ai evidence verifier, human packet, and every other
pilot gate all pass. A passing packet still does not perform release or
activation; the controlled operator procedure remains the final execution
boundary.
