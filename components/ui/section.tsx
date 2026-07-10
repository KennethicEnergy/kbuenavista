import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
};

export function Section({ children, className, id, title, subtitle }: SectionProps) {
  return (
    <section id={id} className={cn("w-full pb-8", className)}>
      {(title || subtitle) && (
        <header className="mb-6 animate-fade-up">
          {title ? (
            <h2 className="font-display text-xl font-semibold tracking-tight text-brand md:text-2xl ">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-sm text-text-muted">{subtitle}</p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
