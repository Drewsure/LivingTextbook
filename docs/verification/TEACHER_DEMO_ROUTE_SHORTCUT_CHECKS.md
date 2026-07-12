# Teacher Demo Route Shortcut Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher` loads.
- The teacher launch page lists Student launch, Unit media when available, Printable Worksheet, Quiz, Sentence Builder, Speak It, Training Academy, Training: Sentences, and Teacher monitor shortcuts.
- Each shortcut points to the current launch code.
- The Printable Worksheet shortcut points to `/print/demo-unit-1`.
- The focused Training Academy shortcut includes `?focus=sentence-review`.
- The panel text identifies the routes as scaffold/demo routes.
- The panel does not replace permanent QR registry rules.
