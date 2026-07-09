# Partner Demo Active Route Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/partner-demo` loads.
- The partner route list includes Student launch, Quiz, Sentence Builder, Speak It, Training Academy, and Teacher monitor.
- Each route uses `partner-demo-unit-1` where appropriate.
- The page still identifies the tenant as the sample publisher, not MiniStar.
- The route list does not imply production QR approval.
