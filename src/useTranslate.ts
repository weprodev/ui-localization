import { useTranslation } from 'react-i18next';
import { ITranslation } from './type';

export default function useTranslate<T>(
  translationLanguage: object
): ITranslation<T> {
  const { t } = useTranslation();

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

  return createTranslationProxy() as ITranslation<T>;
}
