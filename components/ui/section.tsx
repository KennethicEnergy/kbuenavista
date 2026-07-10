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
    <section id={id} className={cn("w-full py-12 md:py-16", className)}>
      {(title || subtitle) && (
        <header className="mb-8 animate-fade-up">
          {title ? (
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-text-muted">{subtitle}</p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
