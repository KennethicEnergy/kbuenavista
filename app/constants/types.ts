export type TimelineItemProps = {
  title: string;
  company: string;
  date: string;
  projectUrl: string | null;
  companyUrl: string | null;
  description: string | Array<string>;
  isCurrent?: boolean;
}

export type ActivityData = {
  id: number;
  title: string;
  organization: string;
  organizationUrl: string | null;
  date: string;
  location: string | null;
  description: string;
}

export type TimelineData = {
  id: number;
  title: string;
  company: string;
  companyUrl: string | null;
  date: string;
  description: string | string[];
  projectUrl: string | null;
  projectImages: Array<string> | null;
  projectGif: string | null;
  projectName: string | null;
  projectDescription: string | null;
  projectTechStack: Array<string> | null;
}

export type Theme = 'light' | 'dark';
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ApplicationStore {
  theme: Theme;
  isPageLoading: boolean;
  isAlertOpen: boolean;
  alertMessage: string | null;
  alertType: AlertType | null;
  isAlertDismissable: boolean;
  setTheme: (theme: Theme) => void;
  setAlert: (type: AlertType, message: string, isDismissable?: boolean) => void;
  setIsPageLoading: (loading: boolean) => void;
  setIsAlertOpen: (open: boolean) => void;
  resetAlert: () => void;
}
