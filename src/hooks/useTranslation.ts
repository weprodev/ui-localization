import { useTranslation as useTranslationI18next } from 'react-i18next';

/**
 * Hook that provides a translation function.
 * 
 * @returns Translation function
 */
export const useTranslation = () => {
  const { t } = useTranslationI18next();
  return t;
}