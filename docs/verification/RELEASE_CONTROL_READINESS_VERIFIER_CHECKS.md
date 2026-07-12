# Release Control Readiness Verifier Checks

## Scope

Run after publish gate, approval ledger, pilot release candidate, pilot handoff, package release, or release-control storage changes.

## Automated Command

```powershell
npm run verify:release-control
```

This command is also included in:

```powershell
npm run verify:foundation
```

## What It Protects

- Required publish gates remain present.
- Required approval signoffs remain present.
- Controlled demo visibility stays separate from pilot-publishable status.
- Release candidate readiness is derived from open gates and open approvals.
- Package publish gate and approval ledger panels show blocked/open states.
- Backend schema and migration specs preserve release candidate, publish gate, and approval ledger records.

## Human Follow-Up

Open `http://127.0.0.1:3000/teacher/intake` and confirm `Pilot release candidate`, `Package publish gate`, and `Package approval ledger` do not imply production publishing while blockers remain open.
