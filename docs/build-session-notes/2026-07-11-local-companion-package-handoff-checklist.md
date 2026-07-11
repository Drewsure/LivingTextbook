# 2026-07-11: Local Companion Package Handoff Checklist

## Summary

Added a package handoff checklist to `/local/sample-publisher`. The checklist separates publisher-provided source and media rights, platform-generated package/checksum artifacts, and school-owned local report policy.

## Verification

- `npm run verify:foundation`
- `http://127.0.0.1:3000/local/sample-publisher`

## Notes

- The checklist is planning-only.
- Missing media rights, checksums, and local report policy keep the package from being offline-ready.
