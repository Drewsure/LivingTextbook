# 2026-08-25 Build Session: AI Generation Request Packet Preview

## Summary

Added a review-only AI generation request packet preview to teacher generator routes. The panel shows evidence links, progress boundaries, required-before-live items, blocked actions, guard blocks, and guard warnings for MiniStar and the sample publisher.

## Rule Added

The request packet preview must remain a readable preflight. It cannot call a model, estimate real cost, generate drafts, submit to a verifier, assemble packages, write routes, create playlists, assign students, mark content student-ready, or use support-language activity for progress.

## Files Added

- `packages/content-model/src/aiGenerationRequestPacketPreview.ts`
- `apps/web/src/data/sampleAiGenerationRequestPacketPreview.ts`
- `apps/web/src/features/content-intake/AiGenerationRequestPacketPreviewPanel.tsx`

## Next Step

Continue the AI generator foundation by tightening the reviewed request-to-draft handoff before adding provider integrations or live model calls.
