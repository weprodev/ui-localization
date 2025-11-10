import { useTranslation as useTranslationI18next } from 'react-i18next';

/**
 * Fallback translation hook that provides direct access to the i18next translation function.
 * 
 * **⚠️ Use this hook only as an escape hatch when the type-safe `useTranslation` hook 
 * encounters TypeScript errors or limitations.**
 * 
 * This hook bypasses all type safety and returns the raw i18next translation function.
 * The main `useTranslation` hook should be preferred in 99% of cases.
 * 
 * @returns The raw i18next translation function without type safety
 * 
 * @example
 * ```typescript
 * // Only use when the main useTranslation hook has TypeScript issues
 * const t = useTranslationFallback();
 * 
 * // Standard i18next usage - no type safety
 * const text = t('common.hello');
 * const withVars = t('greeting', { name: 'John' });
 * const withCount = t('items', { count: 5 });
 * ```
 */
export const useTranslationFallback = () => {
  const { t } = useTranslationI18next();
  return t;
};
