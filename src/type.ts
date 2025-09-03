// Utility type to recursively convert nested objects to translation functions
export type TranslationKeys<T> = {
  [K in keyof T]: T[K] extends object ? TranslationKeys<T[K]> : string;
};

// Generic translation type that can work with any translation structure
export type ITranslation<T> = TranslationKeys<T>;
