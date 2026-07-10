import { create } from "zustand";
import type { ReactNode } from "react";

export type ToastType = "success" | "info" | "danger" | "warning";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  icon?: ReactNode;
  position: ToastPosition;
  durationMs: number;
};

type ShowToastInput = {
  message: string;
  type: ToastType;
  icon?: ReactNode;
  position?: ToastPosition;
  durationMs?: number;
};

type ToasterStore = {
  toasts: Toast[];
  show: (input: ShowToastInput) => string;
  dismiss: (id: string) => void;
};

const DEFAULT_DURATION_MS = 4500;
const DEFAULT_POSITION: ToastPosition = "top-right";

let toastId = 0;

function nextToastId() {
  toastId += 1;
  return `toast-${toastId}`;
}

export const useToasterStore = create<ToasterStore>((set) => ({
  toasts: [],
  show: ({
    message,
    type,
    icon,
    position = DEFAULT_POSITION,
    durationMs = DEFAULT_DURATION_MS,
  }) => {
    const id = nextToastId();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, icon, position, durationMs }],
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
