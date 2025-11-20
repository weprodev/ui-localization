export type { LanguageStore, LocalizationConfig, Path, PathValue, TranslateFunction, NestedRecord, Primitive } from './core/types'
export { initLocalization } from './core/initLocalization'

export { useLanguage } from './hooks/useLanguage'
export { useTranslation } from './hooks/useTranslation'
export type { UseTranslationReturn } from './hooks/useTranslation'
export { useTranslationFallback } from './hooks/useTranslationFallback'
export { createTranslation } from './utils/createTranslation'
export type { ComponentMap } from './core/types'
