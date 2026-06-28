import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--tenant-primary)] bg-[var(--tenant-primary)] text-[var(--tenant-primary-text)] hover:brightness-95",
  secondary:
    "border-[var(--tenant-border)] bg-[var(--tenant-surface)] text-[var(--tenant-text)] hover:bg-[var(--tenant-primary-soft)]",
  quiet:
    "border-transparent bg-transparent text-[var(--tenant-muted)] hover:bg-[var(--tenant-primary-soft)] hover:text-[var(--tenant-text)]",
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
