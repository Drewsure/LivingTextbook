# DR-1203: Package Readiness Identifiers

Package-readiness reconciliation now validates bounded safe identities for its
package, tenant, release, evidence, and gate references. This prevents a
malformed or path-like reference from being attached to a release decision
without changing review-only or promotion-blocked behavior. See ADR 1203.
