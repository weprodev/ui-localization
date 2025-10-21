import { useCallback } from "react";
import { useTranslation as useTranslationI18next } from "react-i18next";

export const useLanguage = () => {
  const { i18n } = useTranslationI18next();

  const currentLanguage = i18n.resolvedLanguage || i18n.language;
  
  const availableLanguages = Object.keys(i18n.options?.resources || {});

  const changeLanguage = useCallback(
    async (language: string): Promise<void> => {
      await i18n.changeLanguage(language);
    },
    [i18n]
  );

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
  };
};
