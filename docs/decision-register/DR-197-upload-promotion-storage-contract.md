# DR-197: Upload Promotion Storage Contract

## Decision

Add durable upload promotion gate records as a separate storage contract from upload intake and upload review records.

## Rationale

Upload intake answers what file arrived. Upload review answers whether its packets and decision are reviewable. Upload promotion answers whether a reviewed upload can create a target record. Keeping promotion separate prevents object storage, local folder placement, or a review decision from becoming a draft, game, playlist, local bundle, or assignment by accident.

## Implications

- Shared content-model persistence categories include `upload-promotion`.
- Hosted and local adapter plans include upload promotion write intents.
- Backend schema, migration candidates, and migration specs include `upload_promotion_gate`.
- Promotion remains blocked until target records, target review, and release-control policy exist.

## Next

Only implement live promotion after target-specific records are stable: teacher draft package promotion, game asset/label anchor promotion, media playlist promotion, and local bundle promotion.
