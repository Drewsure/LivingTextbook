# Launch Safety Boundary Checks

Run after changing student launch routes, front-door routes, private assignment routes, teacher session monitor routes, report package routes, classroom launch gates, or active route verification.

## Command

```powershell
npm run verify:launch-safety
```

## Checks

- Direct student launch routes show `Controlled student practice`.
- Front-door routes show `Controlled front-door practice`.
- Private assignment routes show `Controlled assignment practice`.
- Student-facing doorways show `No live classroom launch`, `Target language unlocks progress`, and `No production student accounts`.
- Teacher session monitor routes show `Session launch gate boundary`.
- Report package routes show `Session launch gate boundary`.
- Teacher/report routes show `Real learner data blocked` and `Report export still blocked`.
- The build-session checklist preserves the launch-safety rule before live classroom launch, report export, or real learner data collection work begins.

## Boundary

This verifier does not make any route live. It only confirms that preview, dry-run, assignment, report, and QR-facing surfaces keep launch and learner-data boundaries visible.
