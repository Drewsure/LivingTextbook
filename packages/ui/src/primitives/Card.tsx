import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "article" | "section" | "div";
}

export function Card({ as = "section", children, className = "", ...props }: CardProps) {
  const Component = as;

  return (
    <Component
      className={[
        "rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-5 shadow-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
