import type { ReactNode } from "react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageHero({
  actions,
  children,
  className,
  description,
  eyebrow,
  title,
}: PageHeroProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20",
        className,
      )}
    >
      <div>
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          {description}
        </p>
        {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
