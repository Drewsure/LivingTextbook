# Printable Worksheet Route Checks

Run after printable worksheet, route, QR/audio bridge, package data, or print-layout changes.

```powershell
npm run verify:foundation
```

Manual route checks:

- Open `http://127.0.0.1:3000/print/demo-unit-1`.
- Open `http://127.0.0.1:3000/print/partner-demo-unit-1`.
- Confirm each route shows `Printable worksheet preview`.
- Confirm each route shows `Browser-print preview`.
- Confirm each route shows vocabulary and sentence sections from reviewed package data.
- Confirm each route shows `PDF export blocked`.
- Confirm each route states that paper work does not create Star Dust, mastery, or completion.
- Confirm the print button only triggers browser print and does not export a PDF.
- Confirm the app navigation/header is hidden in print preview.
- Confirm worksheet sections avoid awkward page breaks where practical.
