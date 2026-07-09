# Media Rights Readiness Contract

Document type: implementation contract

Status: active scaffold

## Purpose

Media rights readiness defines whether audio, video, posters, transcripts, optional background media, and offline bundle assets can be used in a demo, pilot, printed QR flow, or local companion package.

Media is part of the Living Textbook core package. It is not an afterthought.

## Current States

- `cleared-for-demo`
- `needs-proof`
- `blocked`

## Required Fields

Each media rights record should identify:

- media asset id,
- tenant,
- media kind,
- owner,
- source reference,
- allowed use cases,
- missing proof,
- fallback plan.

## Required Rules

- Production student playback requires ownership or license proof.
- Game-background use must be approved separately from ordinary playback.
- Offline/local bundle use must be approved separately from hosted playback.
- Missing production files require fallback behavior.
- Learner-critical audio must have a fallback; optional media can be disabled.
- Blocked media cannot be used in production routes or printed QR releases.

## Acceptance Criteria

- `/teacher/intake` shows media rights readiness before deployment/local bundle panels.
- MiniStar sample media is demo-cleared but still missing production file/offline proof.
- Sample publisher audio needs proof.
- Sample publisher video is blocked.
- Fallback plans are visible.
