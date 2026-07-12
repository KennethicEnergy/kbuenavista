export const PENDING_RESUME_DOWNLOAD_KEY = "resumeDownloadAfterAuth";

export function isMobileClient(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768
  );
}

export function setPendingResumeDownload(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(PENDING_RESUME_DOWNLOAD_KEY, "1");
}

/** Returns true if a pending flag was present (and clears it). */
export function consumePendingResumeDownload(): boolean {
  if (typeof localStorage === "undefined") return false;
  const pending = localStorage.getItem(PENDING_RESUME_DOWNLOAD_KEY) === "1";
  if (pending) localStorage.removeItem(PENDING_RESUME_DOWNLOAD_KEY);
  // Clear legacy sessionStorage flag if present
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(PENDING_RESUME_DOWNLOAD_KEY);
  }
  return pending;
}

export function openResumeUrl(url: string): void {
  if (isMobileClient()) {
    window.location.assign(url);
    return;
  }
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
