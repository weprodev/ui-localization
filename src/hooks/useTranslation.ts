import { useTranslation as useTranslationI18next } from 'react-i18next';
import { Translation } from '../core/types';

const useTranslation = <T>(
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
            // Return the translated string
            return t(key);
          }
        },
      }
    );
  };

  return createTranslationProxy() as Translation<T>;
}

export default useTranslation;