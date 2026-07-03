"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import styles from "./timeline-item.module.scss";
import { CiImageOn } from "react-icons/ci";
import { TimelineItemProps } from "@/app/constants/types";
import { useAppStore } from "@/app/store/app-store";

const DESCRIPTION_LINE_CLAMP = 3;

const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  company,
  date,
  projectUrl,
  companyUrl,
  description,
  isCurrent = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { setIsPageLoading, isPageLoading, theme } = useAppStore();

  const toggleClamp = () => {
    setIsExpanded((prev) => !prev);
  };

  if (isPageLoading) return null;

  return (
    <div className={styles.timelineItem}>
      <div className={`${styles.marker} ${isCurrent ? styles.markerCurrent : ""}`} />
      <div className={styles.content}>
        <h3 className={styles.title}>
          {title}
          {projectUrl && (
            <Link href={`/${projectUrl}`} className={styles.icon} onClick={() => setIsPageLoading(true)} aria-label={`View ${title} project`}>
              <CiImageOn size={20} />
            </Link>
          )}
        </h3>
        {companyUrl ? (
          <a
            href={companyUrl}
            className={styles.company}
            target="_blank"
            rel="noopener noreferrer"
          >
            {company}
          </a>
        ) : (
          <p className={styles.companyStatic}>{company}</p>
        )}
        <p className={styles.date}>{date}</p>
        {typeof (description) === "string" ? (
          <p
            ref={descriptionRef}
            className={styles.description}
            style={{ WebkitLineClamp: isExpanded ? "unset" : DESCRIPTION_LINE_CLAMP }}
          >
            {description}
          </p>
        ) : (
          <ul className={styles.descriptionList}>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={toggleClamp}
          data-theme={theme}
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      </div>
    </div>
  );
};

export default TimelineItem;
