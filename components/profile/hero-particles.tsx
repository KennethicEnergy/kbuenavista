"use client";

import { useMemo, type CSSProperties } from "react";
import { type Engine, type ISourceOptions } from "@tsparticles/engine";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

async function initParticles(engine: Engine) {
  await loadSlim(engine);
}

const particleOptions: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: {
      value: 72,
      density: { enable: true, width: 1200, height: 800 },
    },
    color: { value: ["#aaff00", "#7a90b0", "#f0f4ff"] },
    links: {
      enable: true,
      color: "#aaff00",
      distance: 140,
      opacity: 0.18,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.55,
      direction: "none",
      outModes: { default: "out" },
    },
    opacity: {
      value: { min: 0.15, max: 0.55 },
    },
    size: {
      value: { min: 1, max: 2.8 },
    },
  },
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: {
        enable: true,
        mode: "parallax",
      },
    },
    modes: {
      parallax: {
        force: 45,
        smooth: 18,
      },
    },
  },
};

type HeroParticlesProps = {
  className?: string;
  style?: CSSProperties;
};

export function HeroParticles({ className, style }: HeroParticlesProps) {
  const options = useMemo(() => particleOptions, []);

  return (
    <div className={className} style={style} aria-hidden>
      <ParticlesProvider init={initParticles}>
        <Particles id="hero-particles" options={options} className="h-full w-full" />
      </ParticlesProvider>
    </div>
  );
}
