import React from 'react'
import i18n from 'i18next'
import { Trans } from 'react-i18next'
import { TranslateFunction, NestedRecord, Path, ComponentMap } from '../core/types'

export const createTranslation = <T extends NestedRecord>(_translationLanguage: T): TranslateFunction<T> => {
  const t = (<K extends Path<T> & string>(key: K, ...args: any[]): string | React.JSX.Element => {
    const params = args[0] as Record<string, string | number> | undefined
    const components = args[1] as ComponentMap | undefined

    // If components are provided, use Trans component for interpolation
    if (components !== undefined) {
      return React.createElement(Trans, {
        i18nKey: key,
        values: params,
        components: components as { [tagName: string]: React.ReactElement },
      })
    }

    // Otherwise, use regular translation
    const result = i18n.t(key, params)
    return typeof result === 'string' ? result : String(result)
  }) as TranslateFunction<T>

  return t
}
