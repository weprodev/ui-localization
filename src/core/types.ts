import { Resource } from "i18next";

export interface LanguageStore {
  getLanguage(): string | null;
  setLanguage(language: string): void;
}

export interface LocalizationConfig {
  resources: Resource;
  fallbackLng?: string;
  compatibilityJSON?: "v4";
  interpolation?: {
    escapeValue?: boolean;
  };
  languageStore?: LanguageStore;
}