"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import {
  type Container,
  type Engine,
  type ISourceOptions,
} from "@tsparticles/engine";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

async function initParticles(engine: Engine) {
  await loadSlim(engine);
}

function buildParticleOptions(isCoarsePointer: boolean): ISourceOptions {
  return {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: isCoarsePointer ? 30 : 60,
    detectRetina: !isCoarsePointer,
    particles: {
      number: {
        value: isCoarsePointer ? 36 : 72,
        density: { enable: true, width: 1200, height: 800 },
      },
      color: { value: ["#aaff00", "#7a90b0", "#f0f4ff"] },
      links: {
        enable: true,
        color: "#aaff00",
        distance: isCoarsePointer ? 110 : 140,
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
          // Hover parallax is meaningless on touch; keeping it can stall init on some mobile browsers.
          enable: !isCoarsePointer,
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
}

type HeroParticlesProps = {
  className?: string;
  style?: CSSProperties;
};

export function HeroParticles({ className, style }: HeroParticlesProps) {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const options = useMemo(
    () => buildParticleOptions(isCoarsePointer),
    [isCoarsePointer],
  );

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (!container) return;

    const root = container.canvas.domElement?.parentElement;
    if (!root) return;

    const refreshWhenSized = async () => {
      const { clientWidth, clientHeight } = root;
      if (clientWidth > 0 && clientHeight > 0) {
        await container.canvas.windowResize();
        return true;
      }
      return false;
    };

    if (await refreshWhenSized()) return;

    // Mobile layout (dvh / safe-area) can settle after first paint — retry until sized.
    const observer = new ResizeObserver(() => {
      void refreshWhenSized().then((ok) => {
        if (ok) observer.disconnect();
      });
    });
    observer.observe(root);

    // Fallback in case ResizeObserver never fires a usable size.
    window.setTimeout(() => {
      void refreshWhenSized();
      observer.disconnect();
    }, 500);
  }, []);

  return (
    <div className={className} style={style} aria-hidden>
      <ParticlesProvider init={initParticles}>
        <Particles
          id="hero-particles"
          options={options}
          particlesLoaded={particlesLoaded}
          className="absolute inset-0 h-full w-full"
          style={{ width: "100%", height: "100%" }}
        />
      </ParticlesProvider>
    </div>
  );
}
