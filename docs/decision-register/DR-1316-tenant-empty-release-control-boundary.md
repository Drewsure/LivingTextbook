# DR-1316: Tenant-Empty Release-Control Boundary

Date: 2026-09-30
Status: Accepted

The release-control route now resolves a tenant and shows an explicit empty
state when that tenant has no release candidate. Only the Sample Publisher
tenant receives the reference release room. New publishers do not inherit its
package, QR, approval, or delivery identities. All release actions remain
blocked. See ADR 1317.
