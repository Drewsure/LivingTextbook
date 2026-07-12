# Share And Embed Readiness Checks

Run:

```powershell
npm run verify:share-embed
```

Expected result:

- Private assignment links are planned as the first share path.
- Teacher colleague sharing is planned through tenant-private copy/review flows.
- Public share links are blocked for v1.
- Website iframe embeds are optional and blocked until embed rules exist.
- Public community discovery is blocked for v1.
- Tenant access control, reporting boundaries, embed origin policy, and rights visibility are required gates.

Manual review:

- Open `http://127.0.0.1:3000/teacher/intake`.
- Confirm the Share and embed readiness panel is visible.
- Confirm private assignment links are the first share path.
- Confirm public sharing is blocked.
- Confirm iframe embed is blocked for v1.
- Confirm the panel does not imply public community discovery is ready.
