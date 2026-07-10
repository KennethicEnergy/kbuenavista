import type { ReactNode } from "react";
import {
  useToasterStore,
  type ToastPosition,
  type ToastType,
} from "@/store/toaster-store";

function show(
  type: ToastType,
  message: string,
  icon?: ReactNode,
  position?: ToastPosition,
) {
  return useToasterStore.getState().show({ message, type, icon, position });
}

export const toaster = {
  success: (message: string, icon?: ReactNode, position?: ToastPosition) =>
    show("success", message, icon, position),
  info: (message: string, icon?: ReactNode, position?: ToastPosition) =>
    show("info", message, icon, position),
  warning: (message: string, icon?: ReactNode, position?: ToastPosition) =>
    show("warning", message, icon, position),
  danger: (message: string, icon?: ReactNode, position?: ToastPosition) =>
    show("danger", message, icon, position),
  error: (message: string, icon?: ReactNode, position?: ToastPosition) =>
    show("danger", message, icon, position),
  dismiss: (id: string) => useToasterStore.getState().dismiss(id),
};
