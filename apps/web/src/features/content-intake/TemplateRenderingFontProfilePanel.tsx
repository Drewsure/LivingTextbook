import { Card, StatusPill } from "@living-textbook/ui";
import type {
  FontAccessibilityProfilePreview,
  ProfileReadinessStatus,
  TemplateRenderingFontProfilePlan,
  TemplateRenderingProfilePreview,
} from "@/data/sampleTemplateRenderingFontProfiles";

interface TemplateRenderingFontProfilePanelProps {
  plan: TemplateRenderingFontProfilePlan;
}

const statusTone: Record<ProfileReadinessStatus, "neutral" | "warning"> = {
  "blocked-live": "warning",
  "foundation-preview": "neutral",
  "requires-review": "warning",
};

export function TemplateRenderingFontProfilePanel({ plan }: TemplateRenderingFontProfilePanelProps) {
  const blockedProfiles =
    plan.templateProfiles.filter((profile) => !profile.studentFacingRenderingAllowed).length +
    plan.fontProfiles.filter((profile) => !profile.studentFacingFontAllowed).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Rendering and font profile gate</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedProfiles} student-facing blocks`} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Foundation rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.foundationRule}</p>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {plan.templateProfiles.map((profile) => (
          <TemplateProfileCard key={profile.profileId} profile={profile} />
        ))}
        {plan.fontProfiles.map((profile) => (
          <FontProfileCard key={profile.profileId} profile={profile} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <ProfileTextList title="Required records before live rendering" items={plan.requiredRecords} tone="neutral" />
        <ProfileTextList title="Review gates" items={plan.reviewGates} tone="warning" />
      </div>
    </Card>
  );
}

function TemplateProfileCard({ profile }: { profile: TemplateRenderingProfilePreview }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{profile.profileId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{profile.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">Source template: {profile.sourceTemplate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={profile.status} tone={statusTone[profile.status]} />
          <StatusPill
            label={profile.studentFacingRenderingAllowed ? "Student-facing allowed" : "Student-facing rendering blocked"}
            tone={profile.studentFacingRenderingAllowed ? "neutral" : "warning"}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ProfileTextList title="Compatible families" items={profile.compatibleFamilies} tone="neutral" />
        <ProfileTextList title="Row shape policy" items={profile.rowShapePolicy} tone="neutral" />
        <ProfileTextList title="Media slot policy" items={profile.mediaSlotPolicy} tone="warning" />
        <ProfileTextList title="Layout constraints" items={profile.layoutConstraints} tone="warning" />
      </div>

      <ProfileTextList title="Blocked rendering shortcuts" items={profile.blockedShortcuts} tone="warning" />
    </article>
  );
}

function FontProfileCard({ profile }: { profile: FontAccessibilityProfilePreview }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{profile.profileId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{profile.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">Learner default: {profile.approvedLearnerFont}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={profile.status} tone={statusTone[profile.status]} />
          <StatusPill
            label={profile.studentFacingFontAllowed ? "Student-facing allowed" : "Student-facing font blocked"}
            tone={profile.studentFacingFontAllowed ? "neutral" : "warning"}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ProfileTextList title="Tenant font pack" items={profile.tenantFontPack} tone="neutral" />
        <ProfileTextList title="Language rendering rules" items={profile.languageRenderingRules} tone="warning" />
        <ProfileTextList title="Readability checks" items={profile.readabilityChecks} tone="warning" />
        <ProfileTextList title="Blocked font shortcuts" items={profile.blockedShortcuts} tone="warning" />
      </div>
    </article>
  );
}

function ProfileTextList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

