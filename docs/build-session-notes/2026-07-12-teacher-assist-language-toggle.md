# 2026-07-12 Teacher Assist Language Toggle

## Summary

Added a local teacher control for assist-language visibility.

## Built

- `apps/web/src/features/tenant/assistLanguageSettings.ts`
- `apps/web/src/features/teacher/TeacherAssistLanguagePanel.tsx`
- `/teacher` support-language control
- Student launch support-language visibility reads the local teacher setting

## Rule Preserved

Assist language helps comprehension only. It cannot complete English practice, unlock games, award mastery, or replace target-language listening.

## Verification

Run:

```powershell
npm run verify:foundation
```
