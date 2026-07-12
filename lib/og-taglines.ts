import {
  introductionIntervalSeconds,
  introductions,
} from "@/content/site";

export const OG_TAGLINES = introductions;

/** How often the OG/Twitter image tagline advances (seconds). */
export const OG_TAGLINE_INTERVAL_SECONDS = introductionIntervalSeconds;

export function getRotatingTagline(
  intervalSeconds: number = OG_TAGLINE_INTERVAL_SECONDS,
  now: number = Date.now(),
): string {
  const index = Math.floor(now / (intervalSeconds * 1000)) % OG_TAGLINES.length;
  return OG_TAGLINES[index] ?? OG_TAGLINES[0];
}
