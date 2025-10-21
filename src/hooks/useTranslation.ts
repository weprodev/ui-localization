import { useTranslation as useTranslationI18next } from 'react-i18next';

export const useTranslation = () => {
  const { t } = useTranslationI18next();
  return t;
}