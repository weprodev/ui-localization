import i18n from 'i18next'
import { TranslateFunction, NestedRecord, Path } from '../core/types'

export const createTranslation = <T extends NestedRecord>(_translationLanguage: T): TranslateFunction<T> => {
  const t = (<K extends Path<T> & string>(key: K, ...args: any[]): string => {
    const params = args[0]
    const result = i18n.t(key, params)
    return typeof result === 'string' ? result : String(result)
  }) as TranslateFunction<T>

  return t
}
