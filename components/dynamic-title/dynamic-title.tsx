"use client";

import { useEffect } from "react";

const DEFAULT_TITLE = "Kenneth Buenavista";
const IDLE_TITLE = "Hire Me ✋";

export default function DynamicTitle() {
  useEffect(() => {
    let intervalId: number | undefined;

    const stopBlink = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
      document.title = DEFAULT_TITLE;
    };

    const startBlink = () => {
      stopBlink();
      let showIdle = true;
      document.title = IDLE_TITLE;
      intervalId = window.setInterval(() => {
        document.title = showIdle ? DEFAULT_TITLE : IDLE_TITLE;
        showIdle = !showIdle;
      }, 1000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        startBlink();
      } else {
        stopBlink();
      }
    };

    document.title = DEFAULT_TITLE;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopBlink();
    };
  }, []);

  return null;
}
