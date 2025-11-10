export type {
  LanguageStore,
  LocalizationConfig,
} from "./core/types";
export { initLocalization } from "./core/initLocalization";

export { useLanguage } from "./hooks/useLanguage";
export { useTranslation } from "./hooks/useTranslation";
export { useTranslationFallback } from "./hooks/useTranslationFallback";
export { useTranslationWithInterpolation } from "./hooks/useTranslationWithInterpolation";
export { useTranslationInjection } from "./hooks/useTranslationInjection";
