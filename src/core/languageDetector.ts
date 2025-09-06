import { LanguageStore } from './types';

export const createLanguageDetectorPlugin = (languageStore: LanguageStore) => ({
  type: 'languageDetector' as const,
  async: false,
  init: () => {},
  detect(callback: (lang: string) => void) {
    try {
      const language = languageStore.getLanguage();
      if (language) {
        return callback(language);
      } else {
        return callback('en');
      }
    } catch (error) {
      // Silent error handling - return default language
      return callback('en');
    }
  },
  cacheUserLanguage(language: string) {
    try {
      languageStore.setLanguage(language);
    } catch (error) {
      // Silent error handling - ignore storage errors
    }
  },
});
