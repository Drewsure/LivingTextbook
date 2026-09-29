"use client";

export function PrintReviewSheetButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
    >
      Print review sheet
    </button>
  );
}
