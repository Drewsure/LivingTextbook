# DR-195: Upload Review Storage Contract

## Decision

Add durable upload review records as a separate storage contract from upload intake records.

## Rationale

Upload intake records describe the file and its origin. Upload review records describe the reviewed packets, reviewer identity, decision status, and blocked promotion path. Keeping these separate prevents folder placement, object storage, or a preview decision from becoming a student-facing asset by accident.

## Implications

- Shared content-model persistence categories include `upload-review`.
- Hosted and local adapter plans include upload review write intents.
- Backend schema, migration candidates, and migration specs include `upload_review_decision`.
- Upload review records preserve review packets and block promotion.
- Direct game assignment, automatic PDF-to-game publishing, uploaded media as mastery trigger, and offline approval bypass remain blocked.

## Next

Only add target-specific promotion workflows after reviewer identity, evidence/audit storage, target-specific asset review, release control, and local/hosted storage policy are accepted.
