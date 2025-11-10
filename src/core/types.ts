import { Resource } from "i18next";

/**
 * Interface for language storage operations.
 */
export interface LanguageStore {
  /**
   * Gets the currently stored language.
   * @returns The stored language code or null if none is stored
   */
  getLanguage(): string | null;
  
  /**
   * Sets the language to be stored.
   * @param language - The language code to store
   */
  setLanguage(language: string): void;
}

/**
 * Configuration object for localization initialization.
 */
export interface LocalizationConfig {
  resources: Resource;
  fallbackLng?: string;
  compatibilityJSON?: "v4";
  interpolation?: {
    escapeValue?: boolean;
  };
  languageStore?: LanguageStore;
}