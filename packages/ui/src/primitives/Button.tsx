import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--tenant-accent)] bg-[var(--tenant-accent)] text-[color:var(--tenant-accent-text)] hover:brightness-95",
  secondary:
    "border-[var(--tenant-border)] bg-[var(--tenant-surface)] text-[color:var(--tenant-text)] hover:bg-[var(--tenant-primary-soft)]",
  quiet:
    "border-transparent bg-transparent text-[color:var(--tenant-muted)] hover:bg-[var(--tenant-primary-soft)] hover:text-[color:var(--tenant-text)]",
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
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
    color: "var(--tenant-muted)",
  },
};

export function Button({ children, className = "", variant = "primary", style, ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-accent)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      ].join(" ")}
      style={{
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
