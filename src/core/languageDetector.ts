import { LanguageDetectorModule } from "i18next";
import { LanguageStore } from "./types";

export const createLanguageDetector = (
  languageStore: LanguageStore
): LanguageDetectorModule => ({
  type: "languageDetector",
  detect() {
    try {
      return languageStore.getLanguage() || undefined;
    } catch {
      // Silent error handling - ignore storage errors
      return undefined
    }
  },
  cacheUserLanguage(language: string) {
    try {
      languageStore.setLanguage(language);
    } catch {
      // Silent error handling - ignore storage errors
    }
  },
});
