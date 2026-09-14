import { getRotatingTagline } from "@/lib/og-taglines";

/** Deterministic particle positions for OG (no canvas). */
const PARTICLES = [
  { left: 80, top: 70, size: 4, color: "#aaff00", opacity: 0.45 },
  { left: 160, top: 140, size: 3, color: "#7a90b0", opacity: 0.4 },
  { left: 260, top: 90, size: 5, color: "#aaff00", opacity: 0.35 },
  { left: 380, top: 180, size: 3, color: "#f0f4ff", opacity: 0.3 },
  { left: 520, top: 60, size: 4, color: "#7a90b0", opacity: 0.35 },
  { left: 680, top: 120, size: 3, color: "#aaff00", opacity: 0.5 },
  { left: 820, top: 80, size: 4, color: "#f0f4ff", opacity: 0.28 },
  { left: 960, top: 160, size: 5, color: "#aaff00", opacity: 0.4 },
  { left: 1080, top: 100, size: 3, color: "#7a90b0", opacity: 0.45 },
  { left: 140, top: 280, size: 4, color: "#aaff00", opacity: 0.25 },
  { left: 320, top: 320, size: 3, color: "#7a90b0", opacity: 0.35 },
  { left: 480, top: 260, size: 4, color: "#f0f4ff", opacity: 0.22 },
  { left: 640, top: 340, size: 3, color: "#aaff00", opacity: 0.4 },
  { left: 790, top: 290, size: 5, color: "#7a90b0", opacity: 0.3 },
  { left: 940, top: 360, size: 3, color: "#aaff00", opacity: 0.35 },
  { left: 1100, top: 300, size: 4, color: "#f0f4ff", opacity: 0.25 },
  { left: 200, top: 460, size: 3, color: "#7a90b0", opacity: 0.35 },
  { left: 420, top: 500, size: 4, color: "#aaff00", opacity: 0.3 },
  { left: 700, top: 480, size: 3, color: "#f0f4ff", opacity: 0.28 },
  { left: 980, top: 520, size: 5, color: "#aaff00", opacity: 0.35 },
  { left: 60, top: 540, size: 3, color: "#7a90b0", opacity: 0.3 },
  { left: 1120, top: 450, size: 4, color: "#aaff00", opacity: 0.28 },
] as const;

const LINKS = [
  { x1: 80, y1: 70, x2: 160, y2: 140 },
  { x1: 160, y1: 140, x2: 260, y2: 90 },
  { x1: 260, y1: 90, x2: 380, y2: 180 },
  { x1: 680, y1: 120, x2: 820, y2: 80 },
  { x1: 820, y1: 80, x2: 960, y2: 160 },
  { x1: 320, y1: 320, x2: 480, y2: 260 },
  { x1: 640, y1: 340, x2: 790, y2: 290 },
  { x1: 790, y1: 290, x2: 940, y2: 360 },
  { x1: 420, y1: 500, x2: 700, y2: 480 },
] as const;

function linkStyle(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return {
    position: "absolute" as const,
    left: x1,
    top: y1,
    width: length,
    height: 1,
    backgroundColor: "rgba(170, 255, 0, 0.18)",
    transform: `rotate(${angle}deg)`,
    transformOrigin: "left center",
  };
}

export function renderHeroOgImage() {
  const tagline = getRotatingTagline();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0a1628",
        padding: "56px 64px",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial atmosphere — matches hero */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(170,255,0,0.14), transparent 55%), radial-gradient(ellipse at bottom left, rgba(26,45,74,0.85), transparent 50%)",
        }}
      />

      {/* Particle field */}
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {LINKS.map((link, i) => (
          <div key={`link-${i}`} style={linkStyle(link.x1, link.y1, link.x2, link.y2)} />
        ))}
        {PARTICLES.map((p, i) => (
          <div
            key={`dot-${i}`}
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: 999,
              backgroundColor: p.color,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            color: "#aaff00",
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Philippines
        </div>
        <div
          style={{
            color: "#aaff00",
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          Let’s Work Together!
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          maxWidth: 980,
        }}
      >
        <div
          style={{
            color: "#aaff00",
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
          }}
        >
          Kenneth Buenavista
        </div>
        <div
          style={{
            color: "#f0f4ff",
            fontSize: 28,
            lineHeight: 1.35,
            fontWeight: 500,
            opacity: 0.92,
          }}
        >
          {tagline}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {["React", "Next.js", "TypeScript"].map((label) => (
            <div
              key={label}
              style={{
                color: "#7a90b0",
                fontSize: 20,
                letterSpacing: "0.04em",
                padding: "8px 16px",
                border: "1px solid #1a2d4a",
                borderRadius: 6,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#aaff00",
            color: "#0a1628",
            fontSize: 22,
            fontWeight: 700,
            padding: "14px 28px",
            borderRadius: 8,
          }}
        >
          Download resume
        </div>
        <div style={{ color: "#7a90b0", fontSize: 22 }}>
          Senior Frontend Developer
        </div>
      </div>
    </div>
  );
}
