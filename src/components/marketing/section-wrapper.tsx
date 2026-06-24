import type { ReactNode } from "react";

import { Container } from "@/components/layout";
import { cn } from "@/lib/utils/cn";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionWrapper({
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)} id={id}>
      <Container>{children}</Container>
    </section>
  );
}
