import { ImageResponse } from "next/og";
import { renderHeroOgImage } from "@/lib/og-hero-image";

export const alt = "Kenneth Buenavista — Senior Frontend Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
/** Must be a literal for Next.js segment config analysis. Keep in sync with introductionIntervalSeconds. */
export const revalidate = 8;

export default function TwitterImage() {
  return new ImageResponse(renderHeroOgImage(), { ...size });
}
