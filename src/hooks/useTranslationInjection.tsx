import { $Dictionary } from 'i18next/typescript/helpers';
import { TOptionsBase } from 'i18next/typescript/options';
import { useTranslation } from 'react-i18next';

export const useTranslationInjection = (
  key: string | string[],
  variables: TOptionsBase & $Dictionary
): string => {
  const { t } = useTranslation();
  return t(key, variables);
};