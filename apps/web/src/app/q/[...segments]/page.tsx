import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleEditionQrAliasPlan } from "@/data/sampleEditionQrAliasPlan";
import type { EditionQrAlias } from "@/data/sampleEditionQrAliasPlan";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

interface ParsedQrPath {
  tenantId: string;
  seriesId: string;
  bookId: string;
  unitId: string;
  activityId: string;
  language?: string;
  edition?: string;
  version?: string;
}

export default async function EditionQrPreviewPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  const parsed = parseQrSegments(segments);
  const alias = findAlias(parsed);

  if (!parsed || !alias) {
    notFound();
  }

  const blocked = alias.status === "blocked" || alias.targetPath.startsWith("file:") || alias.targetPath.includes("localhost") || alias.targetPath.includes("127.0.0.1");

  return (
    <AppShell tenant={samplePublisherTenant} compact>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Edition QR resolver preview</p>
            <h2 className="mt-1 text-2xl font-bold">{alias.activityId}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This preview resolves a printed textbook QR identity to a reviewed alias record. It does not perform production redirects yet.
            </p>
          </div>
          <StatusPill label={blocked ? "Blocked" : alias.status} tone={blocked ? "warning" : alias.status === "active" ? "success" : "neutral"} />
        </div>

        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Printed QR id</p>
          <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{alias.printedQrId}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{alias.stableRule}</p>
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ResolveFact label="Edition" value={`${alias.edition} / ${alias.version}`} />
          <ResolveFact label="Target type" value={alias.targetType} />
          <ResolveFact label="Deployment" value={alias.deploymentTarget} />
        </div>

        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Resolved target</p>
              <h3 className="mt-1 break-words text-base font-bold text-[var(--tenant-text)]">{alias.targetPath}</h3>
            </div>
            <StatusPill label={blocked ? "Do not open" : "Preview only"} tone={blocked ? "warning" : "success"} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
            <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {alias.nextStep}
          </p>
          {!blocked && (
            <a className="mt-4 inline-flex rounded-lg border border-[var(--tenant-border)] px-4 py-3 text-sm font-bold text-[var(--tenant-text)]" href={alias.targetPath}>
              Open resolved preview
            </a>
          )}
        </section>

        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Guardrails</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {alias.notAllowedYet.map((guardrail) => (
              <li key={guardrail} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {guardrail}
              </li>
            ))}
          </ul>
        </section>
      </Card>
    </AppShell>
  );
}

function ResolveFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function parseQrSegments(segments: string[]): ParsedQrPath | undefined {
  const parsed: ParsedQrPath = {
    tenantId: getSegmentValue(segments, "tenant"),
    seriesId: getSegmentValue(segments, "series"),
    bookId: getSegmentValue(segments, "book"),
    unitId: getSegmentValue(segments, "unit"),
    activityId: getSegmentValue(segments, "activity"),
    language: getOptionalSegmentValue(segments, "language"),
    edition: getOptionalSegmentValue(segments, "edition"),
    version: getOptionalSegmentValue(segments, "version"),
  };

  if (!parsed.tenantId || !parsed.seriesId || !parsed.bookId || !parsed.unitId || !parsed.activityId) {
    return undefined;
  }

  return parsed;
}

function getSegmentValue(segments: string[], key: string): string {
  return getOptionalSegmentValue(segments, key) ?? "";
}

function getOptionalSegmentValue(segments: string[], key: string): string | undefined {
  const index = segments.indexOf(key);
  const value = index >= 0 ? segments[index + 1] : undefined;

  return value ? decodeURIComponent(value) : undefined;
}

function findAlias(parsed?: ParsedQrPath): EditionQrAlias | undefined {
  if (!parsed) {
    return undefined;
  }

  return sampleEditionQrAliasPlan.aliases.find((alias) => {
    const requiredMatch =
      alias.tenantId === parsed.tenantId &&
      alias.seriesId === parsed.seriesId &&
      alias.bookId === parsed.bookId &&
      alias.unitId === parsed.unitId &&
      alias.activityId === parsed.activityId;

    const languageMatch = !parsed.language || alias.language === parsed.language;
    const editionMatch = !parsed.edition || alias.edition === parsed.edition;
    const versionMatch = !parsed.version || alias.version === parsed.version;

    return requiredMatch && languageMatch && editionMatch && versionMatch;
  });
}
