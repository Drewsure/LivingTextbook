# DR-854: Review Contract Public Boundary

Review-only evidence, verifier, intake-readiness, prototype-return, and AI
generation-preview contracts used by the web application are public
content-model contracts. Panels and sample fixtures consume them through the
package root, preventing reusable platform surfaces from coupling to internal
file paths. This is ownership hardening only and does not authorize live AI,
uploads, persistence, assignment, or Phaser promotion. See ADR 0777.
