"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { cn } from "@/lib/utils/cn";
import {
  useToasterStore,
  type Toast,
  type ToastPosition,
  type ToastType,
} from "@/store/toaster-store";

const typeClass: Record<ToastType, string> = {
  success: "border-success bg-success/15 text-text-primary",
  info: "border-brand bg-brand/15 text-text-primary",
  warning: "border-warning bg-warning/15 text-text-primary",
  danger: "border-danger bg-danger/15 text-text-primary",
};

const iconClass: Record<ToastType, string> = {
  success: "text-success",
  info: "text-brand",
  warning: "text-warning",
  danger: "text-danger",
};

const positionClass: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

function ToastItem({ toast }: { toast: Toast }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      useToasterStore.getState().dismiss(toast.id);
    }, toast.durationMs);
    return () => window.clearTimeout(timer);
  }, [toast.durationMs, toast.id]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-[min(100vw-2rem,22rem)] items-start gap-3 rounded-md border border-solid px-4 py-3 shadow-lg animate-fade-up",
        typeClass[toast.type],
      )}
    >
      {toast.icon ? (
        <span className={cn("mt-0.5 shrink-0", iconClass[toast.type])} aria-hidden>
          {toast.icon}
        </span>
      ) : null}
      <p className="flex-1 text-sm leading-snug">{toast.message}</p>
      <button
        type="button"
        className="shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
        onClick={() => useToasterStore.getState().dismiss(toast.id)}
        aria-label="Dismiss"
      >
        <IoClose size={16} />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToasterStore((state) => state.toasts);
  const positions = Array.from(new Set(toasts.map((toast) => toast.position)));

  return (
    <>
      {positions.map((position) => (
        <div
          key={position}
          aria-label="Notifications"
          className={cn(
            "pointer-events-none fixed z-[100] flex max-h-screen flex-col gap-2",
            positionClass[position],
          )}
        >
          {toasts
            .filter((toast) => toast.position === position)
            .map((toast) => (
              <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
      ))}
    </>
  );
}
