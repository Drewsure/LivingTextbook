import { Card, StatusPill } from "@living-textbook/ui";
import type {
  GameModeSettingsProfile,
  GameModeSettingsProfilePlan,
  GameModeSettingsStatus,
} from "@/data/sampleGameModeSettingsProfiles";

interface GameModeSettingsProfilePanelProps {
  plan: GameModeSettingsProfilePlan;
}

const statusTone: Record<GameModeSettingsStatus, "neutral" | "success" | "warning"> = {
  "safe-default": "success",
  "teacher-review": "warning",
  blocked: "neutral",
};

const statusLabel: Record<GameModeSettingsStatus, string> = {
  "safe-default": "Safe default",
  "teacher-review": "Teacher review",
  blocked: "Blocked",
};

export function GameModeSettingsProfilePanel({ plan }: GameModeSettingsProfilePanelProps) {
  const reviewCount = plan.profiles.filter((profile) => profile.status === "teacher-review").length;
  const safeCount = plan.profiles.filter((profile) => profile.status === "safe-default").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Timer and difficulty profile</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${plan.profiles.length} mode settings`} tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.decisionRule}</p>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SettingsMetric label="Safe defaults" value={String(safeCount)} tone="success" />
        <SettingsMetric label="Teacher review" value={String(reviewCount)} tone="warning" />
        <SettingsMetric label="Release gates" value={String(plan.releaseGates.length)} tone="neutral" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {plan.profiles.map((profile) => (
          <SettingsProfileCard key={profile.profileId} profile={profile} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">Global settings rules</h3>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {plan.globalRules.map((rule, index) => (
            <li key={`${plan.planId}-global-rule-${index}`}>{rule}</li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function SettingsMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function SettingsProfileCard({ profile }: { profile: GameModeSettingsProfile }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {profile.engineId} engine / {profile.gameMode}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{profile.label}</h3>
        </div>
        <StatusPill label={statusLabel[profile.status]} tone={statusTone[profile.status]} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <SettingsFact label="Timer" value={profile.timerPolicy} />
        <SettingsFact label="Motion" value={profile.motionIntensity} />
        <SettingsFact label="Attempts" value={profile.attemptsPolicy} />
      </dl>

      <div className="mt-4 grid gap-3">
        <SettingsBlock title="Difficulty" items={[profile.difficultyPolicy]} />
        <SettingsBlock title="Audio and media" items={[profile.learningAudioPriority, profile.backgroundMediaPolicy]} />
        <SettingsBlock title="Progress boundaries" items={[profile.targetLanguageProgressTrigger, profile.assistLanguagePolicy]} />
        <SettingsBlock title="Blocked actions" items={profile.blockedActions} />
      </div>
    </article>
  );
}

function SettingsFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function SettingsBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
