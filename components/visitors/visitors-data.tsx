import type { ReactNode } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdFileDownload, MdShowChart, MdToday } from "react-icons/md";

export type VisitorsDataProps = {
  total: number;
  uniqueDownloaders: number;
  downloadsToday: number;
};

const metrics: {
  key: keyof Pick<VisitorsDataProps, "total" | "uniqueDownloaders" | "downloadsToday">;
  label: string;
  icon: ReactNode;
}[] = [
    {
      key: "total",
      label: "Total Download CV",
      icon: <MdFileDownload size={22} aria-hidden />,
    },
    {
      key: "uniqueDownloaders",
      label: "Unique downloaders",
      icon: <HiOutlineUsers size={22} aria-hidden />,
    },
    {
      key: "downloadsToday",
      label: "Downloads today",
      icon: <MdToday size={22} aria-hidden />,
    },
  ];

export function VisitorsData({
  total,
  uniqueDownloaders,
  downloadsToday,
}: VisitorsDataProps) {
  const values = { total, uniqueDownloaders, downloadsToday };

  return (
    <div
      className="border-t border-bg-elevated px-5 py-5"
      aria-labelledby="visitors-data-title"
    >
      <div className="flex items-center gap-2">
        <MdShowChart size={20} className="text-brand" aria-hidden />
        <h3
          id="visitors-data-title"
          className="font-display text-base font-semibold tracking-tight text-text-primary"
        >
          Visitors Data
        </h3>
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <li key={metric.key} className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-bg-elevated text-brand">
              {metric.icon}
            </div>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold tabular-nums text-text-primary flex gap-2 items-center">
                {values[metric.key]}
                <span className="text-sm text-text-muted">{metric.label}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-text-muted">
        Resume downloads from signed-in visitors. Today uses UTC.
      </p>
    </div>
  );
}
