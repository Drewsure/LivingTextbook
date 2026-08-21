"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import { getUnitKey } from "@living-textbook/content-model";
import type {
  ContentPackage,
  GameModeId,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { GameRouteHeaderCard } from "@/features/game-shell/components/GameRouteHeaderCard";
import {
  getBalloonPopPath,
  getFillInTheBlankPath,
  getFlashcardsPath,
  getLabelItPath,
  getMatchUpPath,
  getMediaPlaylistPath,
  getMemoryMatchPath,
  getPrintableWorksheetPath,
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getSpellingPracticePath,
  getStudentLaunchPath,
  getTrainingAcademyPath,
  getTypeAnswerPath,
  getTrueFalsePath,
} from "@/features/routes/routeContracts";
import type { TenantConfig } from "@/features/tenant/types";

interface StudentActivityHubFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  contentPackage: ContentPackage;
}

interface ActivityHubItem {
  id: string;
  label: string;
  href: string;
  mode?: GameModeId;
  role: "entry" | "reinforcement" | "assessment" | "recovery" | "support";
  summary: string;
  status: "ready" | "locked" | "complete" | "support";
}

export function StudentActivityHubFlow({
  tenant,
  unit,
  launchSession,
  progression,
  contentPackage,
}: StudentActivityHubFlowProps) {
  const unitKey = getUnitKey(unit.unitMeta);
  const playlist = contentPackage.playlists?.find((candidate) => candidate.unitKey === unitKey);
  const entryComplete = progression.completedGameModes.includes(launchSession.entryMode);
  const activities = buildActivityItems({
    launchSession,
    progression,
    playlistId: playlist?.playlistId,
  });
  const readyCount = activities.filter((activity) => activity.status === "ready" || activity.status === "complete").length;

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <GameRouteHeaderCard
        eyebrow="Curated activity pathway"
        title={`${unit.unitMeta.theme} activity hub`}
        summary="Open reviewed routes for this unit. This is a curated pathway, not a switch-to-anything panel: target-language activity unlocks progress, while media and print remain support-only."
        statusLabel={`${readyCount}/${activities.length} ready`}
        statusTone={entryComplete ? "success" : "warning"}
      />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Student route map</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
              <AudioCueText
                text="Start with flashcards. Then use the reviewed activities your teacher assigns."
                label="Tap the activity hub instruction to hear it"
                className="text-sm"
              />
            </p>
          </div>
          <StatusPill label={tenant.displayName} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {activities.map((activity) => (
            <ActivityRouteCard key={activity.id} activity={activity} />
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold">Pathway rules</h3>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <RuleCard label="Progress trigger" value="Target language only" />
          <RuleCard label="Support routes" value="Media and print do not unlock mastery" />
          <RuleCard label="Template policy" value="Reviewed choices only" />
        </div>
      </Card>
    </div>
  );
}

function ActivityRouteCard({ activity }: { activity: ActivityHubItem }) {
  const blocked = activity.status === "locked";

  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">{activity.label}</h4>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{activity.role}</p>
        </div>
        <StatusPill label={formatStatus(activity.status)} tone={getStatusTone(activity.status)} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
        <AudioCueText
          text={activity.summary}
          label={`Tap the ${activity.label} route summary to hear it`}
          className="text-sm"
        />
      </p>
      {blocked ? (
        <p className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold text-[var(--tenant-muted)]">
          Complete flashcards first.
        </p>
      ) : (
        <a
          href={activity.href}
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open activity
        </a>
      )}
      <p className="mt-2 break-all text-xs font-semibold text-[var(--tenant-muted)]">{activity.href}</p>
    </article>
  );
}

function RuleCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function buildActivityItems({
  launchSession,
  progression,
  playlistId,
}: {
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  playlistId?: string;
}): ActivityHubItem[] {
  const launchCode = launchSession.launchCode;
  const entryComplete = progression.completedGameModes.includes(launchSession.entryMode);
  const entryStatus = entryComplete ? "complete" : "ready";
  const modeItems: ActivityHubItem[] = [
    {
      id: "student-launch",
      label: "Student launch",
      href: getStudentLaunchPath(launchCode),
      role: "entry",
      summary: "Open the classroom QR doorway with flashcards, unlock flow, media shortcut, and progress summary.",
      status: "ready",
    },
    {
      id: "flashcards",
      label: "Flashcards",
      href: getFlashcardsPath(launchCode),
      mode: "flashcards",
      role: "entry",
      summary: "Listen to every reviewed target-language term and sentence before completing entry practice.",
      status: entryStatus,
    },
    {
      id: "memory-match",
      label: "Memory Match",
      href: getMemoryMatchPath(launchCode),
      mode: "memory-match",
      role: "reinforcement",
      summary: "Match vocabulary cards with tap-to-speak support.",
      status: getGameRouteStatus("memory-match", progression),
    },
    {
      id: "match-up",
      label: "Match Up",
      href: getMatchUpPath(launchCode),
      mode: "match-up",
      role: "reinforcement",
      summary: "Match listening prompts to reviewed vocabulary word cards.",
      status: getGameRouteStatus("match-up", progression),
    },
    {
      id: "label-it",
      label: "Label It",
      href: getLabelItPath(launchCode),
      mode: "label-it",
      role: "reinforcement",
      summary: "Place reviewed labels on picture points. Uploaded images must stay reviewed before student use.",
      status: getGameRouteStatus("label-it", progression),
    },
    {
      id: "quiz",
      label: "Quiz",
      href: getQuizPath(launchCode),
      mode: "quiz",
      role: "assessment",
      summary: "Answer reviewed vocabulary and sentence prompts with audio-supported choices.",
      status: getGameRouteStatus("quiz", progression),
    },
    {
      id: "true-false",
      label: "True or False",
      href: getTrueFalsePath(launchCode),
      mode: "true-false",
      role: "assessment",
      summary: "Listen to a target-language word and decide whether the visible card matches.",
      status: getGameRouteStatus("true-false", progression),
    },
    {
      id: "type-answer",
      label: "Type Answer",
      href: getTypeAnswerPath(launchCode),
      mode: "type-answer",
      role: "reinforcement",
      summary: "Listen to a reviewed word and type the target-language answer.",
      status: getGameRouteStatus("type-answer", progression),
    },
    {
      id: "spelling-practice",
      label: "Spelling Practice",
      href: getSpellingPracticePath(launchCode),
      mode: "spelling-practice",
      role: "reinforcement",
      summary: "Listen to a reviewed word and tap deterministic letter tiles in target-language spelling order.",
      status: getGameRouteStatus("spelling-practice", progression),
    },
    {
      id: "fill-in-the-blank",
      label: "Fill in the Blank",
      href: getFillInTheBlankPath(launchCode),
      mode: "fill-in-the-blank",
      role: "reinforcement",
      summary: "Listen to a reviewed sentence and choose the missing target-language word or phrase.",
      status: getGameRouteStatus("fill-in-the-blank", progression),
    },
    {
      id: "balloon-pop",
      label: "Balloon Pop",
      href: getBalloonPopPath(launchCode),
      mode: "balloon-pop",
      role: "reinforcement",
      summary: "Pop the matching vocabulary balloon with audio-supported prompts.",
      status: getGameRouteStatus("balloon-pop", progression),
    },
    {
      id: "sentence-builder",
      label: "Sentence Builder",
      href: getSentenceBuilderPath(launchCode),
      mode: "sentence-builder",
      role: "reinforcement",
      summary: "Build reviewed target sentences from ordered word tiles.",
      status: getGameRouteStatus("sentence-builder", progression),
    },
    {
      id: "speak-it",
      label: "Speak It",
      href: getSpeakItPath(launchCode),
      mode: "speak-it",
      role: "reinforcement",
      summary: "Practice listening and speaking with teacher-controlled microphone options.",
      status: getGameRouteStatus("speak-it", progression),
    },
    {
      id: "training",
      label: "Training Academy",
      href: getTrainingAcademyPath(launchCode),
      role: "recovery",
      summary: "Review missed vocabulary or sentence practice without random rewards or AI Tutor dependency.",
      status: "support",
    },
    {
      id: "print",
      label: "Printable Worksheet",
      href: getPrintableWorksheetPath(launchCode),
      role: "support",
      summary: "Open the browser-print worksheet preview. Print and media support practice but do not unlock mastery.",
      status: "support",
    },
  ];

  if (playlistId) {
    modeItems.push({
      id: "media",
      label: "Unit media",
      href: getMediaPlaylistPath(playlistId),
      role: "support",
      summary: "Open reviewed unit audio and video. Media is support-only and cannot complete target-language practice.",
      status: "support",
    });
  }

  return modeItems;
}

function getGameRouteStatus(mode: GameModeId, progression: StudentProgressionState): ActivityHubItem["status"] {
  if (progression.completedGameModes.includes(mode)) {
    return "complete";
  }

  return progression.unlockedGameModes.includes(mode) ? "ready" : "locked";
}

function formatStatus(status: ActivityHubItem["status"]): string {
  if (status === "complete") {
    return "Complete";
  }

  if (status === "ready") {
    return "Ready";
  }

  if (status === "support") {
    return "Support";
  }

  return "Locked";
}

function getStatusTone(status: ActivityHubItem["status"]): "neutral" | "success" | "warning" {
  if (status === "complete" || status === "ready") {
    return "success";
  }

  return status === "locked" ? "warning" : "neutral";
}
