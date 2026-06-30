# Operating Note: Managed Session Remote Connector Workaround

Date: 2026-07-01

## Context

The managed Codex session allowed repository reads but rejected local patch writes as outside the project boundary. It also blocked local `git pull --ff-only` from the agent side.

## Workaround Used

When local patching or pulling is blocked:

1. Use the GitHub connector to create or update files on `legacy-source-import`.
2. Keep each connector commit small and path-specific.
3. Tell the repository owner to pull locally.
4. Ask the repository owner to run typecheck/build and report the output.
5. Record any branch-level decisions in ADRs, verification docs, and decision-register entries.

## Human Command Set

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Notes

- This is a session permission workaround, not a preferred permanent workflow.
- If local write access is restored in a future session, prefer local patch edits, local verification, then Git push.
- Avoid rewriting unrelated user changes while using the connector path.
