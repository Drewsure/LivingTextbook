import QRCode from "qrcode";
import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherPilotQrPreview } from "@living-textbook/content-model";
import { PrintReviewSheetButton } from "./PrintReviewSheetButton";

export async function PublisherPilotQrPrintSheet({ qrs }: { qrs: PublisherPilotQrPreview[] }) {
  const renderedQrs = await Promise.all(
    qrs.map(async (qr) => ({
      qr,
      svg: await QRCode.toString(qr.aliasPath, {
        type: "svg",
        errorCorrectionLevel: "M",
        margin: 2,
        width: 220,
      }),
    })),
  );

  return (
    <Card className="print:break-inside-avoid print:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">QR print-sheet preview</p>
          <h3 className="mt-1 text-lg font-bold">Review the actual code symbols before release</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These QR symbols encode stable alias paths and are suitable for internal review or classroom rehearsal. Production textbook printing remains blocked until the package, rights, persistence, release, and rollback gates are accepted.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill label="Review sheet" tone="success" />
          <StatusPill label="Production print blocked" tone="warning" />
          <PrintReviewSheetButton />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {renderedQrs.map(({ qr, svg }) => (
          <article key={qr.printedQrId} className="rounded-lg border border-[var(--tenant-border)] p-4 print:break-inside-avoid">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{qr.printedQrId}</p>
                <h4 className="mt-1 text-base font-bold">{qr.targetLabel}</h4>
              </div>
              <StatusPill label={qr.status} tone="warning" />
            </div>
            <div className="mt-4 flex justify-center rounded-lg bg-white p-4" role="img" aria-label={`Review QR code for ${qr.targetLabel}`} dangerouslySetInnerHTML={{ __html: svg }} />
            <p className="mt-3 break-all font-mono text-xs leading-5 text-[var(--tenant-muted)]">{qr.aliasPath}</p>
            <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">Fallback: {qr.fallbackPath}</p>
            <p className="mt-3 text-xs font-semibold text-[var(--tenant-muted)]">Encoded for review only; no production redirect mutation.</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
