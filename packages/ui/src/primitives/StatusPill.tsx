interface StatusPillProps {
  label: string;
  tone?: "neutral" | "success" | "warning";
}

const toneClasses = {
  neutral: "bg-[var(--tenant-primary-soft)] text-[var(--tenant-text)]",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
};

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
