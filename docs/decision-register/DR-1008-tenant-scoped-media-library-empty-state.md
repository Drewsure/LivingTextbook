# DR-1008: Tenant-Scoped Media Library Empty State

Date: 2026-09-30  
Status: Accepted

## Decision

Safe white-label tenants may open a tenant media library before media rights
records exist. The library shows an empty, blocked preview and links to tenant
upload intake; it never displays MiniStar or Sample Publisher media.

## Safety boundary

This is a read-only routing and filtering decision. It does not upload,
transcode, store, replace, publish, create playlists, award progress, activate
local media, or expose student-facing media.

## Rationale

Multimedia is part of the Living Textbook package from the start. The review
path must therefore exist for every publisher, while actual media use remains
bound to rights, accessibility, package, and release evidence.

See ADR 1292.
