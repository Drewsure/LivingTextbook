"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { AudioCueButton } from "./AudioCueButton";

interface AudioSupportedActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  audioText: string;
  audioLanguage: string;
  variant?: "primary" | "secondary" | "quiet";
}

const actionStyles: Record<"primary" | "secondary" | "quiet", CSSProperties> = {
  primary: {
    backgroundColor: "var(--tenant-accent)",
    borderColor: "var(--tenant-accent)",
    color: "var(--tenant-accent-text)",
  },
  secondary: {
    backgroundColor: "var(--tenant-surface)",
    borderColor: "var(--tenant-border)",
    color: "var(--tenant-text)",
  },
  quiet: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "var(--tenant-text)",
  },
};

export function AudioSupportedAction({
  children,
  audioText,
  audioLanguage,
  variant = "primary",
  type = "button",
  style,
  className = "",
  onClick,
  ...buttonProps
}: AudioSupportedActionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AudioCueButton text={audioText} language={audioLanguage} label={`Hear action: ${audioText}`} compact />
      <button
        type={type}
        className={`${getActionClasses(variant)} ${className}`}
        style={{
          ...actionStyles[variant],
          ...style,
        }}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </button>
    </div>
  );
}

function getActionClasses(variant: "primary" | "secondary" | "quiet"): string {
  const variantClasses = {
    primary: "border-[var(--tenant-accent)] bg-[var(--tenant-accent)] text-[color:var(--tenant-accent-text)] hover:brightness-95",
    secondary: "border-[var(--tenant-border)] bg-[var(--tenant-surface)] text-[color:var(--tenant-text)] hover:bg-[var(--tenant-primary-soft)]",
    quiet: "border-transparent bg-transparent text-[color:var(--tenant-muted)] hover:bg-[var(--tenant-primary-soft)] hover:text-[color:var(--tenant-text)]",
  } as const;

  return [
    "inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-accent)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
  ].join(" ");
}
