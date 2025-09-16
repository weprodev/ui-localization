import { useCallback } from "react";
import i18n from "i18next";

const useLanguage = () => {
  const currentLanguage = i18n.language;
  const availableLanguages = Object.keys(i18n.options?.resources || {});

  const changeLanguage = useCallback(
    async (language: string): Promise<void> => {
      await i18n.changeLanguage(language);
    },
    []
  );

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
  };
};

export default useLanguage;
