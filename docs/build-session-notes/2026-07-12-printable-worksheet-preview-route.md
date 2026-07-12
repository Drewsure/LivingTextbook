# 2026-07-12 Printable Worksheet Preview Route

## Summary

Added the first practical printable route as a browser-print preview while keeping PDF export blocked.

## Built

- `apps/web/src/app/print/[code]/page.tsx`
- `apps/web/src/features/printables/PrintableWorksheetPreview.tsx`
- Teacher launch shortcut for the current unit printable preview
- Active route matrix entries for `/print/demo-unit-1` and `/print/partner-demo-unit-1`
- Active route verification checks for both printable routes

## Rule Preserved

Browser-print preview is allowed from reviewed package data.

PDF export remains blocked until QR/audio placement, version and rights snapshots, teacher export policy, and formal printable handoff rules exist.

## Verification

Run:

```powershell
npm run verify:foundation
```
