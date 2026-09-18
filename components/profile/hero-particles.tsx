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
    // Retina canvases on iOS Safari often end up oversized / blank in nested absolute layouts.
    detectRetina: false,
    pauseOnBlur: false,
    particles: {
      number: {
        // Density scales count by canvas/area — on phones that collapses to ~10
        // barely-visible dots. Use a fixed count on coarse pointers instead.
        value: isCoarsePointer ? 48 : 72,
        density: isCoarsePointer
          ? { enable: false }
          : { enable: true, width: 1200, height: 800 },
      },
      color: { value: ["#aaff00", "#7a90b0", "#f0f4ff"] },
      links: {
        enable: true,
        color: "#aaff00",
        distance: isCoarsePointer ? 100 : 140,
        opacity: isCoarsePointer ? 0.28 : 0.18,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.55,
        direction: "none",
        outModes: { default: "out" },
      },
      opacity: {
        value: isCoarsePointer
          ? { min: 0.28, max: 0.7 }
          : { min: 0.15, max: 0.55 },
      },
      size: {
        value: isCoarsePointer
          ? { min: 1.2, max: 3.2 }
          : { min: 1, max: 2.8 },
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    // Defer mount one frame so Safari has resolved layout/% heights.
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => {
      media.removeEventListener("change", update);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const options = useMemo(
    () => buildParticleOptions(isCoarsePointer),
    [isCoarsePointer],
  );

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (!container) return;

    const canvas = container.canvas.domElement;
    const root = canvas?.parentElement;
    if (!root || !canvas) return;

    const refreshWhenSized = async () => {
      const { clientWidth, clientHeight } = root;
      if (clientWidth <= 0 || clientHeight <= 0) return false;

      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";

      await container.canvas.windowResize();
      return true;
    };

    if (await refreshWhenSized()) return;

    // Mobile layout (dvh / safe-area) can settle after first paint — retry until sized.
    const observer = new ResizeObserver(() => {
      void refreshWhenSized().then((ok) => {
        if (ok) observer.disconnect();
      });
    });
    observer.observe(root);

    const onResume = () => {
      void refreshWhenSized();
    };
    window.addEventListener("orientationchange", onResume);
    document.addEventListener("visibilitychange", onResume);

    // Fallback in case ResizeObserver never fires a usable size.
    window.setTimeout(() => {
      void refreshWhenSized();
      observer.disconnect();
      window.removeEventListener("orientationchange", onResume);
      document.removeEventListener("visibilitychange", onResume);
    }, 700);
  }, []);

  return (
    <div className={className} style={style} aria-hidden>
      {ready ? (
        <ParticlesProvider init={initParticles}>
          <Particles
            id="hero-particles"
            options={options}
            particlesLoaded={particlesLoaded}
            className="absolute inset-0 !h-full !w-full"
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </ParticlesProvider>
      ) : null}
    </div>
  );
}
