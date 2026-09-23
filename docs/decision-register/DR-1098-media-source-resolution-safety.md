# DR-1098: Media Source Resolution Safety

- Hosted and local media locators are validated at the final browser delivery
  boundary.
- The resolver preserves explicit hosted-first/local-first behavior and fails
  closed for unsafe, traversal, credential-bearing, protocol, control-character,
  and oversized paths.
- Resolver success is not rights approval, package promotion, or permission
  for media-only progression.

References: ADR 1098, Build session 1012, and the media source runtime check.
