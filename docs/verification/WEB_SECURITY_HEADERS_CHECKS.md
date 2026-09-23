# Web Security Header Checks

The web configuration must apply these headers to all routes:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy: microphone=(self), camera=(), geolocation=()`

The verifier also keeps a rigid Content-Security-Policy out until tenant
media/CDN origins and approved embedding origins have an explicit white-label
contract.

Run:

```text
npm run verify:web-security-headers
npm run build --workspace @living-textbook/web
```

These headers complement, but do not replace, route authorization, tenant
isolation, same-origin mutation checks, or persistence deployment gates.
