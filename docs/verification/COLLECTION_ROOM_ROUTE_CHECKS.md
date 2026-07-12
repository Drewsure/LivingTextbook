# Collection Room Route Checks

Run after reward catalog, collection route, student launch rewards, tenant reward names, or progression mechanics change.

```powershell
npm run verify:collection
npm run verify:foundation
```

Open:

- `http://127.0.0.1:3000/collection/demo-unit-1`
- `http://127.0.0.1:3000/collection/partner-demo-unit-1`

Expected result:

- The page shows `Earned collection`.
- The page shows `Collection room preview`.
- The page shows `Mastery unlocks only`.
- The page shows `No random rewards`.
- The page shows `Ownership provenance`.
- The page shows `Unlock source event`.
- The page shows `Policy-gated storage preview`.
- Reward categories include mastery-owned item types such as badges, titles, cosmetics, room items, companion evolution, and power-ups.
- The page uses the tenant reward name.
- The page does not imply paid gacha, random pressure rewards, or premium art is already complete.

Regression guard:

Collection mechanics must remain earned through mastery and completion. Surprise rewards may later exist only as child-safe bonus cosmetics; do not introduce purchase pressure, random progression dependency, or gambling-like mechanics.
