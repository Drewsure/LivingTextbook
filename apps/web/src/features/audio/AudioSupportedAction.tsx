"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Button } from "@living-textbook/ui";
import { AudioCueButton } from "./AudioCueButton";

interface AudioSupportedActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  audioText: string;
  audioLanguage?: string;
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
  audioLanguage = "en",
  variant = "primary",
  type = "button",
  style,
  ...buttonProps
}: AudioSupportedActionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AudioCueButton text={audioText} language={audioLanguage} label={`Hear action: ${audioText}`} compact />
      <Button
        type={type}
        variant={variant}
        style={{
          ...actionStyles[variant],
          ...style,
        }}
        {...buttonProps}
      >
        {children}
      </Button>
    </div>
  );
}
