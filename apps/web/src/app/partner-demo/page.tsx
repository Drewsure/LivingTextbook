import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import {
  samplePartnerContentPackage,
  samplePartnerFrontDoorEntryCode,
  samplePartnerFrontDoorPath,
  samplePartnerFrontDoorUserCode,
  samplePartnerLaunchCode,
  samplePartnerLaunchSession,
  samplePartnerPackageValidationErrors,
  samplePartnerPermanentQrPath,
  samplePartnerUnitOne,
} from "@/data/samplePartnerPackage";
import { GameSequence } from "@/features/game-shell/GameSequence";
import { MultimediaPackagePanel } from "@/features/multimedia/MultimediaPackagePanel";
import { ProgressionSummary } from "@/features/progression/ProgressionSummary";
import {
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getStudentLaunchPath,
  getTeacherSessionMonitorPath,
  getTeacherUnitReviewPath,
  getPrivateAssignmentPath,
  getCollectionPath,
  getPrintableWorksheetPath,
  getTrainingAcademyPath,
  getTeacherPrivateLibraryPath,
  getTeacherMediaLibraryPath,
  getTeacherUploadWorkspacePath,
} from "@/features/routes/routeContracts";
import { getUnitKey } from "@living-textbook/content-model";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";
import { TeacherMicrophonePracticePanel } from "@/features/teacher/TeacherMicrophonePracticePanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default function PartnerDemoPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--tenant-muted)]">White-label proof</p>
                <h2 className="mt-1 text-2xl font-bold">Partner textbook pilot shell</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
                  This route uses a second tenant, a partner-style PDF content package, a different reward name,
                  no MiniStar assist language, and the same reusable launch, media, progression, and speaking contracts.
                </p>
              </div>
              <StatusPill label="Second tenant" tone="success" />
            </div>
          </Card>

          <TeacherLaunchPanel
            unit={samplePartnerUnitOne}
            launchSession={samplePartnerLaunchSession}
            contentPackage={samplePartnerContentPackage}
          />
          <MultimediaPackagePanel
            contentPackage={samplePartnerContentPackage}
            permanentQrPath={samplePartnerPermanentQrPath}
            frontDoorPath={samplePartnerFrontDoorPath}
            validationErrors={samplePartnerPackageValidationErrors}
          />
          <GameSequence unit={samplePartnerUnitOne} />
        </section>

        <aside className="space-y-5">
          <ProgressionSummary tenant={samplePublisherTenant} unit={samplePartnerUnitOne} />
          <TeacherMicrophonePracticePanel tenant={samplePublisherTenant} />
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--tenant-muted)]">Routes to test</p>
                <h2 className="mt-1 text-lg font-bold">Partner package paths</h2>
              </div>
              <StatusPill label="Active scaffold" tone="success" />
            </div>
            <dl className="mt-5 grid gap-3 text-sm text-[var(--tenant-muted)]">
              <RouteLink label="Partner demo" href="/partner-demo" />
              <RouteLink label="Teacher unit review" href={getTeacherUnitReviewPath(getUnitKey(samplePartnerUnitOne.unitMeta))} />
              <RouteLink label="Teacher private library" href={getTeacherPrivateLibraryPath("sample-publisher")} />
              <RouteLink label="Teacher upload workspace" href={getTeacherUploadWorkspacePath("sample-publisher")} />
              <RouteLink label="Teacher media library" href={getTeacherMediaLibraryPath("sample-publisher")} />
              <RouteLink label="Private assignment link" href={getPrivateAssignmentPath("assignment-sample-publisher-front-door")} />
              <RouteLink label="Front door" href={samplePartnerFrontDoorPath} />
              <RouteLink label="Student launch" href={getStudentLaunchPath(samplePartnerLaunchCode)} />
              <RouteLink label="Collection room" href={getCollectionPath(samplePartnerLaunchCode)} />
              <RouteLink label="Printable Worksheet" href={getPrintableWorksheetPath(samplePartnerLaunchCode)} />
              <RouteLink label="Quiz" href={getQuizPath(samplePartnerLaunchCode)} />
              <RouteLink label="Sentence Builder" href={getSentenceBuilderPath(samplePartnerLaunchCode)} />
              <RouteLink label="Speak It" href={getSpeakItPath(samplePartnerLaunchCode)} />
              <RouteLink label="Training Academy" href={getTrainingAcademyPath(samplePartnerLaunchCode)} />
              <RouteLink label="Teacher monitor" href={getTeacherSessionMonitorPath(samplePartnerLaunchCode)} />
            </dl>
            <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
              Demo codes for a future partner front door: {samplePartnerFrontDoorEntryCode} / {samplePartnerFrontDoorUserCode}.
              The front door now resolves tenant-specific packages while direct launch remains useful for QR testing.
            </p>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function RouteLink({ label, href }: { label: string; href: string }) {
  return (
    <div className="grid gap-1">
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd>
        <a
          href={href}
          className="break-words font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
        >
          {href}
        </a>
      </dd>
    </div>
  );
}
