"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@living-textbook/ui";
import { AudioCueButton } from "./AudioCueButton";

interface AudioSupportedActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  audioText: string;
  audioLanguage?: string;
  variant?: "primary" | "secondary" | "quiet";
}

export function AudioSupportedAction({
  children,
  audioText,
  audioLanguage = "en",
  variant,
  ...buttonProps
}: AudioSupportedActionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AudioCueButton text={audioText} language={audioLanguage} label={`Hear action: ${audioText}`} compact />
      <Button variant={variant} {...buttonProps}>
        {children}
      </Button>
    </div>
  );
}
