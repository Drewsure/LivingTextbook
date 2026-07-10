# 2026-07-11: Publisher Maintenance Change Storage Contract

## Summary

Added a vendor-neutral storage contract for publisher maintenance change requests. The contract appears in durable record planning, hosted/local adapter write intents, backend schema draft, migration candidates, and migration specs.

## Verification

- `npm run verify:foundation`
- `http://127.0.0.1:3000/teacher/intake`

## Notes

- This is not live admin editing.
- Change requests cannot directly mutate active routes, media manifests, game offers, or teacher reports.
- Hosted and local deployment paths share the same maintenance vocabulary.
