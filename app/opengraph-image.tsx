import { ImageResponse } from "next/og";
import { getRotatingTagline } from "@/lib/og-taglines";

export const alt = "Kenneth Buenavista — Senior Frontend Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
/** Must be a literal for Next.js segment config analysis. Keep in sync with introductionIntervalSeconds. */
export const revalidate = 8;

export default function OpenGraphImage() {
  const tagline = getRotatingTagline();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a1628",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#aaff00",
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#aaff00",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Kenneth Buenavista
          </div>
          <div
            style={{
              color: "#f0f4ff",
              fontSize: 34,
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            Senior Frontend Developer — React, Next.js, TypeScript
          </div>
          <div style={{ color: "#7a90b0", fontSize: 26 }}>
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#7a90b0",
            fontSize: 24,
          }}
        >
          <span>Philippines</span>
          <span style={{ color: "#aaff00" }}>Hire Me</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
