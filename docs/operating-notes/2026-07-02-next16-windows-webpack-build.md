# Next 16 Windows Webpack Dev/Build Fallback

Date: 2026-07-02
Status: Active

Observed behavior: `next build` and `next dev` can fail on Windows with Turbopack internal errors while processing app routes or CSS through the development/build pipeline. Typecheck and `next build --webpack` can still pass, which indicates the app source and routes are not necessarily broken.

Observed build failure signature:

```text
TurbopackInternalError: Failed to write app endpoint /page
Caused by:
- apps/web/src/app/globals.css [app-client] (css)
- creating new process
- node process exited before we could connect to it with exit code: 0
```

Observed dev route failure signature:

```text
GET /teacher/sessions/demo-unit-1 500
Uncaught Error: An unexpected Turbopack error occurred.
```

Procedure:

1. Use Webpack for the local dev server through the package script: `next dev --webpack`.
2. Use Webpack for production build verification through the package script: `next build --webpack`.
3. Run type generation and typecheck before build verification:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

4. Start the dev server normally through the workspace script after pulling the branch. The script itself owns the Webpack flag:

```powershell
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

5. Treat this as an environment/build-tool workaround, not a reason to remove Tailwind or PostCSS.
6. Revisit this note after a future Next upgrade. If the Turbopack worker failures no longer appear on Windows, the dev/build scripts can be returned to the default builder after successful local and CI verification.

Why this matters: The product should keep a low-cost, standard Next/Tailwind foundation while avoiding repeat interruptions from a build-tool worker failure that does not reflect a product architecture problem.
