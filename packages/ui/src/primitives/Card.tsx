import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "article" | "section" | "div";
}

export function Card({ as = "section", children, className = "", ...props }: CardProps) {
  const Component = as;

  return (
    <Component
      className={["rounded-lg border border-slate-200 bg-white p-5 shadow-sm", className].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
