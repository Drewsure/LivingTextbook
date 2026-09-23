# Session Sign-out Origin Checks

The student and teacher session DELETE routes are foundation-ready only when:

- the request is checked by `validateSameOriginMutation`;
- missing or cross-origin requests return `403` before clearing a cookie;
- same-origin sign-out returns the bounded `signed-out` response; and
- sign-out does not grant persistence, tenant, or report authority.

Static coverage lives in `scripts/verify-persistence-read-authorization.mjs`.
Run `npm run verify:persistence-runtime` and the full foundation gate after
changing session mutation behavior.
