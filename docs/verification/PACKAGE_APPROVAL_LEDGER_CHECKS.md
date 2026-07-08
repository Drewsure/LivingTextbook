# Package Approval Ledger Verification

Use after pulling the latest `legacy-source-import` branch and running local typecheck/build.

## Route

- `http://127.0.0.1:3000/teacher/intake`

## Checks

1. The teacher intake page renders a `Package approval ledger` panel after the package publish gate.
2. The panel shows the release candidate label and approval rule.
3. The top status says approvals are open while required sign-offs remain unsigned.
4. Signed, needs-signoff, and blocked counts match the sample ledger data.
5. Required sign-offs include content, media, games, QR, policy, deployment, and platform release review.
6. Each sign-off shows owner, status, evidence, next step, and cannot-approve-while blockers.
7. Media rights cannot be approved while file ownership or license metadata is missing.
8. Privacy/report policy remains blocked until persistence and export policy are accepted.
9. Deployment/support cannot be approved if closed local deployment is promised without update and backup procedures.
10. Platform release approval remains open until local typecheck/build and route verification are complete.
11. The panel remains backend-agnostic and does not imply real signed approvals exist yet.
12. The panel uses existing tenant styling and does not introduce premium polish.

## Build Verification

Run:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Then open:

- `http://127.0.0.1:3000/teacher/intake`

## Failure Conditions

Do not mark this verified if:

- the ledger implies real human signatures were captured,
- a required sign-off can ignore release blockers,
- tenant-specific approval fields fork the platform model,
- media rights, policy, deployment, or platform release approval are hidden,
- the page fails typecheck/build after sync.
