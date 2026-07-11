# 2026-07-11: Local Companion Artifact Map

## Summary

Added local companion artifact-map data to local bundle manifests and rendered it on `/local/sample-publisher`. The map shows generated, publisher-provided, school-policy, and future-build artifacts with paths, readiness status, blockers, and next actions.

## Verification

- `npm run verify:foundation`
- `http://127.0.0.1:3000/local/sample-publisher`

## Notes

- This is not an exporter. It defines the package contents a future exporter or installer must satisfy.
- Blocked artifacts keep the local companion path honest while still making the white-label product shape concrete.
