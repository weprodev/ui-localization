import { useTranslation as useTranslationI18next } from 'react-i18next';

/**
 * Type utility that recursively maps translation object structure to provide type safety.
 * Converts nested objects to the same structure but with string values for leaf nodes.
 */
type TranslationKeys<T> = {
  [K in keyof T]: T[K] extends object ? TranslationKeys<T[K]> : string;
};

/**
 * Type alias for translation structure with type safety.
 */
type Translation<T> = TranslationKeys<T>;

/**
 * Type-safe translation hook that provides intellisense and type checking for translation keys.
 * 
 * @template T - The type of the translation object structure
 * @param translationLanguage - The translation object to provide type safety for
 * @returns Type-safe translation proxy object
 * 
 * @example
 * ```typescript
 * import en from '../translations/en';
 * 
 * const t = useTranslation<typeof en>(en);
 * const welcome = t.common.welcome; // Type-safe access with intellisense
 * ```
 */
export const useTranslation = <T>(
  translationLanguage: object
): Translation<T> => {
  const { t } = useTranslationI18next();

  const createTranslationProxy = (prefix = ''): any => {
    return new Proxy(
      {},
      {
        get(_target, prop: string) {
          const key = prefix ? `${prefix}.${prop}` : prop;

          // Check if this key exists in the original structure
          const originalValue = prefix
            ? prefix
                .split('.')
                .reduce((obj, k) => obj?.[k], translationLanguage as any)?.[
                prop
              ]
            : (translationLanguage as any)[prop];

          if (typeof originalValue === 'object' && originalValue !== null) {
            // Return a new proxy for nested objects
            return createTranslationProxy(key);
          } else {
            // For leaf nodes or non-existent keys, return the translated string
            return t(key);
          }
        },
      }
    );
  };

  return createTranslationProxy() as Translation<T>;
};
