import React from 'react'
import { useTranslation as useTranslationI18next, Trans } from 'react-i18next'
import { Path, TranslateFunction, NestedRecord, ComponentMap } from '../core/types'

/**
 * Return type for useTranslation hook with type-safe t function
 */
export interface UseTranslationReturn<T extends NestedRecord> {
  t: TranslateFunction<T>
}

export const useTranslation = <T extends NestedRecord>(): UseTranslationReturn<T> => {
  const { t: tI18next } = useTranslationI18next()

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
    const result = tI18next(key, params)
    return typeof result === 'string' ? result : String(result)
  }) as TranslateFunction<T>

  return {
    t,
  }
}
