# 2026-07-12: Assist Language Enable Persistence Field

Added explicit backend/schema migration coverage for `assist_language_teacher_enablement_persisted`.

This keeps support-language visibility from becoming loose package content during persistence implementation. The teacher's on/off choice must be durable before real classroom use.
