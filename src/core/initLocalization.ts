import i18n, { Module, InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DefaultLanguageStore } from './DefaultLanguageStore';
import { LocalizationConfig } from './types';
import { createLanguageDetectorPlugin } from './languageDetector';

export const initLocalization = async (config: LocalizationConfig) => {
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