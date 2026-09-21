"use client";

import { usePathname } from "next/navigation";

interface AppShellNavigationItem {
  label: string;
  href: string;
}

interface AppShellNavigationProps {
  items: AppShellNavigationItem[];
}

export function AppShellNavigation({ items }: AppShellNavigationProps) {
  const pathname = usePathname();
  const activeHref = getMostSpecificActiveHref(pathname, items);

  return (
    <nav className="flex flex-wrap justify-end gap-3 text-sm font-semibold text-[var(--tenant-text)]" aria-label="Primary">
      {items.map((item) => {
        const isCurrent = item.href === activeHref;

        return (
          <a
            key={`${item.label}-${item.href}`}
            href={item.href}
            aria-current={isCurrent ? "page" : undefined}
            data-nav-current={isCurrent ? "page" : "false"}
            className={`rounded-md px-2 py-1 underline-offset-4 transition hover:bg-[var(--tenant-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
              isCurrent ? "bg-[var(--tenant-primary-soft)] underline decoration-[var(--tenant-primary)] decoration-2" : ""
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

function getMostSpecificActiveHref(pathname: string | null, items: AppShellNavigationItem[]): string | undefined {
  if (!pathname) {
    return undefined;
  }

  return items
    .filter((item) => item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;
}
