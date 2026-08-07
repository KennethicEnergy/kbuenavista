import { resolveTechIcon } from "@/components/skills/tech-icons";

type TechStackProps = {
  items: string[];
};

export function TechStack({ items }: TechStackProps) {
  if (!items.length) return null;

  const withIcons: { key: string; label: string; Icon: NonNullable<ReturnType<typeof resolveTechIcon>>["icon"] }[] = [];
  const withoutIcons: string[] = [];

  for (const tech of items) {
    const matched = resolveTechIcon(tech);
    if (matched) {
      withIcons.push({ key: tech, label: matched.label, Icon: matched.icon });
    } else {
      withoutIcons.push(tech);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      {withIcons.length ? (
        <ul className="flex flex-wrap gap-4">
          {withIcons.map(({ key, label, Icon }) => (
            <li
              key={key}
              className="flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-brand"
              title={label}
            >
              <Icon size={28} aria-hidden />
              <span className="text-xs">{label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {withoutIcons.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-text-muted">
          {withoutIcons.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
