"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { ContentPackage, UnitAssistLanguagePlan, UnitPayload } from "@living-textbook/content-model";
import { formatLanguageName } from "@/features/language/languageLabels";
import { getMediaPlaylistPath, getSentenceBuilderPath, getStudentLaunchPath } from "@/features/routes/routeContracts";

interface PrintableWorksheetPreviewProps {
  contentPackage: ContentPackage;
  unit: UnitPayload;
  launchCode: string;
  assistLanguagePlan?: UnitAssistLanguagePlan;
}

export function PrintableWorksheetPreview({
  contentPackage,
  unit,
  launchCode,
  assistLanguagePlan,
}: PrintableWorksheetPreviewProps) {
  const launchPath = getStudentLaunchPath(launchCode);
  const sentencePath = getSentenceBuilderPath(launchCode);
  const playlist = contentPackage.playlists?.find((candidate) => candidate.unitKey === getPrintableUnitKey(unit));
  const audioPlan = contentPackage.audioSupportPlans?.find((candidate) => candidate.unitKey === getPrintableUnitKey(unit));
  const targetLanguage = unit.unitMeta.textbookReference?.language ?? "en";
  const supportLanguage = assistLanguagePlan?.assistLanguage;

  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-4 print:max-w-none print:gap-3 print:p-0">
      <Card className="print:break-inside-avoid print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Printable worksheet preview</p>
            <h1 className="mt-1 text-2xl font-bold">{unit.unitMeta.theme}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Browser-print preview generated from reviewed package data. PDF export blocked until QR/audio placement, version and rights snapshot, and teacher export policy are complete.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <StatusPill label="Browser-print preview" tone="success" />
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              Print
            </button>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <PrintableMetric label="Target language" value={formatLanguageName(targetLanguage)} />
          <PrintableMetric label="Vocabulary" value={`${unit.pedagogicalPayload.vocabularyTerms.length} terms`} />
          <PrintableMetric label="Audio cues" value={`${audioPlan ? audioPlan.vocabularyAudioCueIds.length + audioPlan.sentenceAudioCueIds.length : 0} linked`} />
        </dl>
      </Card>

      <Card className="print:break-inside-avoid print:shadow-none">
        <div className="grid gap-3 md:grid-cols-2">
          <PrintableRoute label="Practice online" path={launchPath} />
          <PrintableRoute label="Sentence builder" path={sentencePath} />
          {playlist ? <PrintableRoute label="Unit media" path={getMediaPlaylistPath(playlist.playlistId)} /> : null}
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">
          Audio bridge: students should use the digital route or teacher playback to hear each term and sentence. Paper work does not award Star Dust, mastery, or completion by itself.
        </p>
      </Card>

      <Card className="print:break-inside-avoid print:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Vocabulary listening sheet</p>
            <h2 className="mt-1 text-lg font-bold">Listen, say, and check</h2>
          </div>
          <StatusPill label="Reviewed package source" tone="success" />
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-[var(--tenant-border)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--tenant-primary-soft)] text-xs uppercase text-[var(--tenant-muted)]">
              <tr>
                <th className="border-b border-[var(--tenant-border)] p-3">Term</th>
                <th className="border-b border-[var(--tenant-border)] p-3">Listen cue</th>
                <th className="border-b border-[var(--tenant-border)] p-3">Support</th>
                <th className="border-b border-[var(--tenant-border)] p-3">Practice</th>
              </tr>
            </thead>
            <tbody>
              {unit.pedagogicalPayload.vocabularyTerms.map((term) => (
                <tr key={term} className="border-b border-[var(--tenant-border)] last:border-b-0">
                  <td className="p-3 text-base font-bold text-[var(--tenant-text)]">{term}</td>
                  <td className="p-3 font-mono text-xs text-[var(--tenant-muted)]">{findAudioCueId(contentPackage, term, "term")}</td>
                  <td className="p-3 text-[var(--tenant-muted)]">
                    {supportLanguage ? `${formatLanguageName(supportLanguage)}: ${assistLanguagePlan?.vocabularyGlosses[term] ?? "review needed"}` : "No assist language"}
                  </td>
                  <td className="p-3 text-[var(--tenant-muted)]">Listen / Say / Trace</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="print:break-inside-avoid print:shadow-none">
        <p className="text-sm font-semibold text-[var(--tenant-muted)]">Sentence practice worksheet</p>
        <h2 className="mt-1 text-lg font-bold">Build the target sentences</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {unit.pedagogicalPayload.targetSentences.map((sentence, index) => (
            <section key={sentence} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Sentence {index + 1}</p>
              <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{sentence}</p>
              <p className="mt-2 font-mono text-xs text-[var(--tenant-muted)]">{findAudioCueId(contentPackage, sentence, "sentence")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {toWordBank(sentence).map((word, wordIndex) => (
                  <span key={`${sentence}-${word}-${wordIndex}`} className="rounded-md border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--tenant-text)]">
                    {word}
                  </span>
                ))}
              </div>
              <div className="mt-4 h-12 rounded-lg border border-dashed border-[var(--tenant-border)] bg-white" />
            </section>
          ))}
        </div>
      </Card>

      <Card className="print:break-inside-avoid print:shadow-none">
        <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package and export boundary</p>
        <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
          <PrintableDetail label="Package" value={contentPackage.meta.packageId} />
          <PrintableDetail label="Source" value={contentPackage.meta.sourceDocumentName ?? contentPackage.meta.sourceType} />
          <PrintableDetail label="Review" value={contentPackage.meta.reviewStatus} />
          <PrintableDetail label="Export" value="PDF export blocked" />
        </dl>
      </Card>
    </main>
  );
}

function PrintableMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function PrintableRoute({ label, path }: { label: string; path: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <a className="mt-2 block break-all font-mono text-xs font-semibold underline underline-offset-4" href={path}>
        {path}
      </a>
    </section>
  );
}

function PrintableDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function findAudioCueId(contentPackage: ContentPackage, text: string, kind: "term" | "sentence"): string {
  return contentPackage.audioCues?.find((cue) => cue.kind === kind && cue.text === text)?.audioCueId ?? "audio cue review needed";
}

function toWordBank(sentence: string): string[] {
  return sentence
    .replace(/[.,!?]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function getPrintableUnitKey(unit: UnitPayload): string {
  return `${unit.unitMeta.tenantId}:${unit.unitMeta.curriculumId}:L${unit.unitMeta.level}:U${unit.unitMeta.unit}`;
}
