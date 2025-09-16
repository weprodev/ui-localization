export type {
  Translation,
  TranslationKeys,
  LanguageStore,
  LocalizationConfig,
} from "./core/types";
export { initLocalization } from "./core/initLocalization";

export { default as useLanguage } from "./hooks/useLanguage";
export { default as useTranslation } from "./hooks/useTranslation";
export { default as useTranslationWithInterpolation } from "./hooks/useTranslationWithInterpolation";
export { default as useTranslationInjection } from "./hooks/useTranslationInjection";
