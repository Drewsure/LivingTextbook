# Private Assignment Link Route Checks

Run after assignment readiness, sharing, route contracts, student launch access, front-door codes, report boundaries, or teacher controls change.

```powershell
npm run verify:foundation
```

Open:

- `http://127.0.0.1:3000/assign/assignment-ministar-demo-whole-class`
- `http://127.0.0.1:3000/assign/assignment-sample-publisher-front-door`

Expected result:

- The page shows `Private assignment link`.
- The page says `Student-facing assignment preview`.
- The page shows `Curated activity pathway`.
- The page shows `Private-first sharing rules`.
- The primary action opens the correct launch or front-door route.
- The page does not expose teacher/admin intake controls.
- The page states that it is not public sharing, public community discovery, or an iframe embed.
- Teacher reports remain policy-blocked until persistence and retention are accepted.

Regression guard:

Private assignment links are the first safe share path. Do not turn this route into public sharing, community resources, or embeddable iframes until tenant access, rights, moderation, reporting, retention, and origin policies are durable.
