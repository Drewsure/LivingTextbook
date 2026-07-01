# Next 16 Windows Production Build Fallback

Date: 2026-07-02
Status: Active

Observed behavior: `next build` can fail on Windows with a Turbopack internal error while processing `apps/web/src/app/globals.css` through PostCSS. The dev server may still start successfully, which indicates the app source and routes are not necessarily broken.

Observed failure signature:

```text
TurbopackInternalError: Failed to write app endpoint /page
Caused by:
- apps/web/src/app/globals.css [app-client] (css)
- creating new process
- node process exited before we could connect to it with exit code: 0
```

Procedure:

1. Keep `npm run dev --workspace @living-textbook/web` on the normal Next dev server path.
2. Use Webpack for production build verification through the package script: `next build --webpack`.
3. Run type generation and typecheck before build verification:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

4. Treat this as an environment/build-tool workaround, not a reason to remove Tailwind or PostCSS.
5. Revisit this note after a future Next upgrade. If the Turbopack/PostCSS worker failure no longer appears on Windows, the build script can be returned to the default builder after successful local and CI verification.

Why this matters: The product should keep a low-cost, standard Next/Tailwind foundation while avoiding repeat interruptions from a build-tool worker failure that does not reflect a product architecture problem.
