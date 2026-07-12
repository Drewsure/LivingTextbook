# Foundation Verification Gate Panel Checks

## Scope

Run after teacher intake, verification scripts, package-readiness, local-bundle, active route, or release gate changes.

## Checks

- Confirm `/teacher/intake` shows `Foundation verification gate`.
- Confirm the panel shows `npm run verify:foundation`.
- Confirm the panel names `npm run verify:package-readiness`.
- Confirm the panel names `npm run verify:local-bundle`.
- Confirm the panel names `npm run verify:class-roster`.
- Confirm the panel includes `Class roster readiness`.
- Confirm the panel names `npm run verify:session-settings`.
- Confirm the panel includes `Teacher session settings safety`.
- Confirm the panel names `npm run verify:backend-storage`.
- Confirm the panel includes `Backend storage readiness`.
- Confirm the panel names `npm run verify:release-control`.
- Confirm the panel includes `Release control readiness`.
- Confirm active route verification checks those strings.
- Confirm the panel describes the gate as a foundation review aid, not a production CI status system.

## Verification Command

```powershell
npm run verify:foundation
```
