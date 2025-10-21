import { $Dictionary } from 'i18next/typescript/helpers';
import { TOptionsBase } from 'i18next/typescript/options';
import { useTranslation } from 'react-i18next';

/**
 * Hook for translation with variable injection.
 * 
 * @param key - Translation key or array of keys
 * @param variables - Variables to inject into the translation
 * @returns Translated string with variables injected
 */
export const useTranslationInjection = (
  key: string | string[],
  variables: TOptionsBase & $Dictionary
): string => {
  const { t } = useTranslation();
  return t(key, variables);
};