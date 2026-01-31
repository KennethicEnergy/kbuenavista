"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./about-slideshow.module.scss";

type AboutSlideshowProps = {
  images: string[];
  intervalMs?: number;
};

export default function AboutSlideshow({ images, intervalMs = 4500 }: AboutSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  if (!images.length) return null;

  return (
    <div className={styles.slideshow}>
      <div className={styles.track}>
        {images.map((src, i) => (
          <div
            key={i}
            className={styles.slide}
            data-active={i === current}
          >
            <Image
              src={src}
              alt={`Slide ${i + 1}`}
              fill
              sizes="(max-width: 580px) 100vw, 580px"
              className={styles.slideImage}
              priority={i === 0}
              unoptimized={src.startsWith("http")}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={styles.dot}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
