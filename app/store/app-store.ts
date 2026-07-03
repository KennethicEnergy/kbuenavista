import { createJSONStorage, persist } from 'zustand/middleware'

import { AlertType, ApplicationStore } from '../constants/types'
import { create } from 'zustand'

let alertTimeoutId: ReturnType<typeof setTimeout> | null = null;

const clearAlertTimeout = () => {
  if (alertTimeoutId) {
    clearTimeout(alertTimeoutId);
    alertTimeoutId = null;
  }
};

export const useAppStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      isPageLoading: false,
      isAlertOpen: false,
      isAlertDismissable: true,
      alertMessage: null,
      alertType: null,
      setTheme: (theme) => set({ theme }),
      setIsAlertOpen: (open) => set({ isAlertOpen: open }),
      setAlert(type: AlertType, message: string, isDismissable = true) {
        clearAlertTimeout();
        set({ alertType: type, alertMessage: message, isAlertDismissable: isDismissable, isAlertOpen: true });
        alertTimeoutId = setTimeout(() => {
          set({ alertType: null, alertMessage: null, isAlertDismissable: true, isAlertOpen: false });
          alertTimeoutId = null;
        }, 5000);
      },
      setIsPageLoading: (loading) => set({ isPageLoading: loading }),
      resetAlert: () => {
        clearAlertTimeout();
        set({ alertType: null, alertMessage: null, isAlertDismissable: true, isAlertOpen: false });
      },
    }),
    {
      name: 'application-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
