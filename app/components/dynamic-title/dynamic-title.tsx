"use client";

import { useEffect } from "react";

const DEFAULT_TITLE = "Kenneth Buenavista";
const IDLE_TITLE = "Hire Me ✋";

export default function DynamicTitle() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      document.title = document.hidden ? IDLE_TITLE : DEFAULT_TITLE;
    };

    document.title = DEFAULT_TITLE;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = DEFAULT_TITLE;
    };
  }, []);

  return null;
}
