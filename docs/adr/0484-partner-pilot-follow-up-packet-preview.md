# ADR 0484: Partner Pilot Follow-Up Packet Preview

Status: Accepted

## Decision

The partner pilot requirements intake will show a typed, review-only follow-up packet preview. It will organize requested evidence, school decisions, demo links, blockers, and the next evidence gate after a first partner meeting.

## Boundaries

- The preview does not send email, download a packet, create attachments, save meeting answers, accept school policy, write storage, export reports, mutate release state, or launch students.
- Each item carries an owner, review route, and reason so the packet remains tenant-aware and evidence-linked.
- Core contents remain source files, media rights, curated pathway approval, entry rules, policy, deployment, and dry-run evidence.
- Premium AI Tutor, microphone, and Z.ai prototype work remain adult decision or blocked review items.

## Verification

Protect the preview with `npm run verify:pilot-requirements`, `npm run verify:routes`, and `npm run verify:foundation`.
