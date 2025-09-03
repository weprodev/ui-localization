// Export types
export type { ITranslation, TranslationKeys } from './type';

// Export i18n configuration and utilities
export {
  type LanguageStore,
  DefaultLanguageStore,
  type I18nConfig,
  initI18n,
  changeLanguage,
  getCurrentLanguage,
  addResourceBundle,
  getAvailableLanguages,
  createI18n,
} from './i18n';

// Export React hooks
export { default as useTranslate } from './useTranslate';
export { default as useTranslateWithInterpolation } from './useTranslateWithInterpolation';
export { default as useTranslationInjection } from './useTranslationInjection';
