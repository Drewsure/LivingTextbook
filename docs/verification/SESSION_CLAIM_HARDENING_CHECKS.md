# Session Claim Hardening Checks

Student session creation must bound these fields before resolving a launch or
creating a cookie:

- tenant, package, launch, and user code: 160 characters
- entry code: 512 characters

Both student and teacher signed-session readers must reject:

- an issuance time more than 30 seconds in the future
- an expired claim
- an expiry at or before issuance

Run:

```text
npm run verify:persistence-runtime
npm run typecheck --workspace @living-textbook/web
```

These checks complement same-origin mutation protection and tenant-scoped
authorization; they do not authorize durable persistence.
