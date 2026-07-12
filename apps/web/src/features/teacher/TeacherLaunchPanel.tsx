import { Card, StatusPill } from "@living-textbook/ui";
import { getUnitKey } from "@living-textbook/content-model";
import type { ContentPackage, LaunchSession, UnitPayload } from "@living-textbook/content-model";
import {
  getMediaPlaylistPath,
  getPrintableWorksheetPath,
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getStudentLaunchPath,
  getTeacherSessionMonitorPath,
  getTrainingAcademyPath,
} from "@/features/routes/routeContracts";

interface TeacherLaunchPanelProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  contentPackage?: ContentPackage;
}

export function TeacherLaunchPanel({ unit, launchSession, contentPackage }: TeacherLaunchPanelProps) {
  const launchPath = getStudentLaunchPath(launchSession.launchCode);
  const playlist = contentPackage?.playlists?.find((candidate) => candidate.unitKey === getUnitKey(unit.unitMeta));
  const routeShortcuts = [
    {
      label: "Student launch",
      href: launchPath,
      summary: "QR entry, flashcards, unlock flow, Memory Match, and local student summary.",
    },
    ...(playlist
      ? [
          {
            label: "Unit media",
            href: getMediaPlaylistPath(playlist.playlistId),
            summary: "Reviewed audio/video playlist for the current unit; support only, not a progression unlock.",
          },
        ]
      : []),
    {
      label: "Printable Worksheet",
      href: getPrintableWorksheetPath(launchSession.launchCode),
      summary: "Browser-print vocabulary and sentence preview; PDF export remains blocked.",
    },
    {
      label: "Quiz",
      href: getQuizPath(launchSession.launchCode),
      summary: "Plain selection-engine baseline before arcade skins.",
    },
    {
      label: "Sentence Builder",
      href: getSentenceBuilderPath(launchSession.launchCode),
      summary: "Text-spelling route for reviewed target sentence construction.",
    },
    {
      label: "Speak It",
      href: getSpeakItPath(launchSession.launchCode),
      summary: "Teacher-controlled listening and local record/replay practice.",
    },
    {
      label: "Training Academy",
      href: getTrainingAcademyPath(launchSession.launchCode),
      summary: "Deterministic recovery lane for missed vocabulary or sentence practice.",
    },
    {
      label: "Training: Sentences",
      href: getTrainingAcademyPath(launchSession.launchCode, "sentence-review"),
      summary: "Focused recovery lane opened directly to reviewed sentence patterns.",
    },
    {
      label: "Teacher monitor",
      href: getTeacherSessionMonitorPath(launchSession.launchCode),
      summary: "Teacher-visible event stream, settings, controls, and report concept.",
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher Launch Protocol</p>
          <h2 className="mt-1 text-lg font-bold">{unit.unitMeta.theme}</h2>
        </div>
        <StatusPill label="Teacher-led" />
      </div>
      <div className="mt-5 grid gap-4">
        <ProtocolBlock label="Hook" value={unit.teacherLaunchProtocol.hook} />
        <ProtocolBlock label="Activity" value={unit.teacherLaunchProtocol.activity} />
        <ProtocolBlock label="Review" value={unit.teacherLaunchProtocol.review} />
      </div>
      <div className="mt-5 grid gap-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">Classroom launch route</p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">{launchPath}</p>
          <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-[var(--tenant-text)]">Code</dt>
              <dd>{launchSession.launchCode}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--tenant-text)]">Status</dt>
              <dd>{launchSession.status}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--tenant-text)]">Entry</dt>
              <dd>{launchSession.entryMode}</dd>
            </div>
          </dl>
        </div>
        <a
          href={launchPath}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open student launch
        </a>
      </div>
      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--tenant-text)]">Demo route shortcuts</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
              Use these reviewed routes for local demos and browser checks. They are still scaffold routes, not production classroom links.
            </p>
          </div>
          <StatusPill label={`${routeShortcuts.length} routes`} tone="neutral" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {routeShortcuts.map((shortcut) => (
            <a
              key={shortcut.href}
              href={shortcut.href}
              className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3 text-sm transition hover:bg-[var(--tenant-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              <span className="font-bold text-[var(--tenant-text)]">{shortcut.label}</span>
              <span className="mt-1 block break-all text-xs font-semibold text-[var(--tenant-muted)]">{shortcut.href}</span>
              <span className="mt-2 block leading-5 text-[var(--tenant-muted)]">{shortcut.summary}</span>
            </a>
          ))}
        </div>
      </section>
    </Card>
  );
}

function ProtocolBlock({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <h3 className="text-sm font-bold text-[var(--tenant-muted)]">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
