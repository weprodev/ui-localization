import i18n, { Module, InitOptions, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

// Generic interface for language store
export interface LanguageStore {
  getLanguage(): string | null;
  setLanguage(language: string): void;
}

// src/stores/DefaultLanguageStore.ts
export class DefaultLanguageStore implements LanguageStore {
  private storage: Map<string, string> = new Map(); // simple in-memory storage

  getLanguage(): string | null {
    return this.storage.get('i18nextLng') || null;
  }

  setLanguage(language: string): void {
    this.storage.set('i18nextLng', language);
  }
}


// Configuration interface
export interface I18nConfig {
  resources: Resource;
  fallbackLng?: string;
  compatibilityJSON?: 'v4';
  interpolation?: {
    escapeValue?: boolean;
  };
  languageStore?: LanguageStore;
  onLanguageChange?: (language: string) => void;
}

// Create a generic language detector plugin
const createLanguageDetectorPlugin = (languageStore: LanguageStore) => ({
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

// Generic i18n initialization function
export const createI18n = (config: I18nConfig) => {
  const {
    resources,
    fallbackLng = 'en',
    compatibilityJSON = 'v4' as const,
    interpolation = { escapeValue: false },
    languageStore = new DefaultLanguageStore(),
    onLanguageChange,
  } = config;

  const languageDetectorPlugin = createLanguageDetectorPlugin(languageStore);

  let currentLanguage: string | null;
  try {
    currentLanguage = languageStore.getLanguage();
  } catch (error) {
    // Fallback to default language if language store fails
    currentLanguage = null;
  }
  if (!currentLanguage) {
    currentLanguage = fallbackLng || 'en';
  }

  const initOptions: InitOptions = {
    resources,
    compatibilityJSON,
    fallbackLng,
    interpolation,
    lng: currentLanguage,
  };

  return i18n
    .use(initReactI18next)
    .use(languageDetectorPlugin as Module)
    .init(initOptions)
    .then(() => {
      // Set up language change listener
      if (onLanguageChange) {
        i18n.on('languageChanged', (lng: string) => {
          onLanguageChange(lng);
        });
      }
      return i18n;
    });
};

// Export the default i18n instance
export default i18n;

// Utility function to get current language
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Utility function to change language
export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
};

// Utility function to get available languages
export const getAvailableLanguages = (): string[] => {
  return Object.keys(i18n.options?.resources || {});
};

// Utility function to initialize i18n (alias for createI18n)
export const initI18n = (config: I18nConfig) => {
  return createI18n(config);
};

// Utility function to add resource bundle
export const addResourceBundle = (
  language: string,
  namespace: string,
  resources: any
): void => {
  i18n.addResourceBundle(language, namespace, resources, true, true);
};
