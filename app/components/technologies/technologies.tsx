"use client";

import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import styles from "./technologies.module.scss";
import { rowIcons } from "@/app/constants/tech-icons";
import { useAppStore } from "@/app/store/app-store";

interface TechnologiesProps {
  hasTitle: boolean;
}

const middleIndex = Math.ceil(rowIcons.length / 2);
const firstRowIcons = rowIcons.slice(0, middleIndex);
const secondRowIcons = rowIcons.slice(middleIndex);

const Technologies: React.FC<TechnologiesProps> = ({ hasTitle }) => {
  const { theme } = useAppStore();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const gradientColor = theme === "dark" ? "#171717" : "#ececec";

  if (prefersReducedMotion) {
    return (
      <div className={styles.technologies}>
        <div className={styles.staticRow}>
          {firstRowIcons.map((icon, index) => (
            <span className={styles.icon} key={index}>{icon} {hasTitle && firstRowIcons[index].key}</span>
          ))}
        </div>
        <div className={styles.staticRow}>
          {secondRowIcons.map((icon, index) => (
            <span className={styles.icon} key={index}>{icon} {hasTitle && secondRowIcons[index].key}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.technologies}>
      <Marquee pauseOnHover loop={0} direction="left" autoFill gradient gradientColor={gradientColor} gradientWidth={50}>
        {firstRowIcons.map((icon, index) => (
          <span className={styles.icon} key={index}>{icon} {hasTitle && firstRowIcons[index].key}</span>
        ))}
      </Marquee>
      <Marquee pauseOnHover loop={0} direction="right" autoFill gradient gradientColor={gradientColor} gradientWidth={50}>
        {secondRowIcons.map((icon, index) => (
          <span className={styles.icon} key={index}>{icon} {hasTitle && secondRowIcons[index].key}</span>
        ))}
      </Marquee>
    </div>
  )
}

export default Technologies;
