# ADR 1303: Keep publisher file intake explicitly opt-in

## Decision

The tenant upload workspace has two deliberate states:

1. The default foundation state is review-only and input-free. It renders the
   upload policy, evidence, custody, and release boundaries without a file
   picker.
2. An operator may explicitly enable the tenant-scoped quarantine file picker
   after provisioning the server gate and quarantine custody root. The picker
   can create only a quarantine intake record through the existing multipart
   intake route.

The opt-in path must continue to show and enforce that scan, rights, source
review, package assembly, QR printing, hosted persistence, and student use are
separate gates.

## Rationale

Publishers need a practical way to submit PDFs, images, audio, music, and video
for a pilot. Hiding the only real intake control behind a permanently
review-only mock would make the saleable workflow misleading. Exposing it by
default would create an unsafe promotion shortcut. A server-controlled,
tenant-scoped quarantine gate keeps both needs visible without conflating
submission with publication.

## Verification boundary

The default route must contain no rendered file input. The source code must
retain the guarded file input and same-origin multipart request so an enabled
operator can rehearse real intake. Every accepted response must remain
quarantine-only, with `promotionAllowed: false` and
`studentFacingUseAllowed: false`.

## Not authorized

This decision does not authorize automatic extraction, package assembly, QR
registry writes, production printing, playlist creation, local delivery, or
student activation.
