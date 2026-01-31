"use client";

import { useEffect } from "react";

const TITLES = ["Kenneth Buenavista", "Hire Me ✋"];

export default function DynamicTitle() {
  useEffect(() => {
    let index = 0;
    document.title = TITLES[0];

    const interval = setInterval(() => {
      index = (index + 1) % TITLES.length;
      document.title = TITLES[index];
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
