import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";

import { DefaultLanguageStore } from "./DefaultLanguageStore";
import { LocalizationConfig } from "./types";
import { createLanguageDetector } from "./languageDetector";

export const initLocalization = async (config: LocalizationConfig) => {
  const {
    resources,
    fallbackLng = "en",
    compatibilityJSON = "v4",
    interpolation = { escapeValue: false },
    languageStore = new DefaultLanguageStore(),
  } = config;

  const languageDetector = createLanguageDetector(languageStore);

  const initOptions: InitOptions = {
    resources,
    compatibilityJSON,
    fallbackLng,
    interpolation,
  };

  return i18n.use(languageDetector).use(initReactI18next).init(initOptions);
};
