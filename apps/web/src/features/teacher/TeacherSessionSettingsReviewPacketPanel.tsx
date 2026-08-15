import { Card, StatusPill } from "@living-textbook/ui";
import {
  getTeacherSessionSettingsReviewPacketWarnings,
  validateTeacherSessionSettingsReviewPacket,
  type TeacherSessionSettingsReviewPacket,
  type TeacherSessionSettingsReviewStatus,
} from "@living-textbook/content-model";

interface TeacherSessionSettingsReviewPacketPanelProps {
  packets: TeacherSessionSettingsReviewPacket[];
}

const statusTone: Record<TeacherSessionSettingsReviewStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "ready-for-pilot": "success",
  "review-only": "neutral",
};

export function TeacherSessionSettingsReviewPacketPanel({
  packets,
}: TeacherSessionSettingsReviewPacketPanelProps) {
  const guardBlocks = packets.flatMap((packet) => validateTeacherSessionSettingsReviewPacket(packet));
  const guardWarnings = packets.flatMap((packet) => getTeacherSessionSettingsReviewPacketWarnings(packet));

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session settings review packet</p>
          <h2 className="mt-1 text-lg font-bold">Teacher choices before classroom launch</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet makes teacher-controlled session choices visible before any setting can be saved. It protects
            target-language progression, tap-to-speak audio, support-language limits, microphone opt-in, background
            media behavior, report policy, and optional paid AI Tutor boundaries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="neutral" />
          <StatusPill label={`${guardBlocks.length} block(s)`} tone={guardBlocks.length > 0 ? "warning" : "success"} />
          <StatusPill label={`${guardWarnings.length} warning(s)`} tone={guardWarnings.length > 0 ? "warning" : "neutral"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <SettingsPacketList
          title="Settings review guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No settings review guard blocks."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <SettingsPacketList
          title="Settings review guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No settings review guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.launchCode}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.tenantId}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={packet.status} tone={statusTone[packet.status]} />
                <StatusPill label="No setting save" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <SettingsPacketFact
                label="Assist language"
                value={packet.settingsSnapshot.assistLanguage.enabled ? "Enabled preview" : "Disabled preview"}
              />
              <SettingsPacketFact
                label="Microphone"
                value={packet.settingsSnapshot.microphonePractice.enabled ? "Teacher opt-in required" : "Disabled"}
              />
              <SettingsPacketFact
                label="AI Tutor"
                value={packet.settingsSnapshot.aiTutor.enabled ? "Premium enabled" : "Optional paid package"}
              />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <SettingsPacketList title="Safety signals" items={packet.safetySignals} />
              <SettingsPacketList title="Policy and cost gates" items={packet.policyAndCostGates} tone="warning" />
              <SettingsPacketList title="Blocked actions" items={packet.blockedActions} tone="warning" />
              <SettingsPacketList title="Required before pilot" items={packet.requiredBeforePilot} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function SettingsPacketFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function SettingsPacketList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
