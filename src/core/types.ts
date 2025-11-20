import { Resource } from 'i18next'
import React from 'react'

/**
 * Interface for language storage operations.
 */
export interface LanguageStore {
  /**
   * Gets the currently stored language.
   * @returns The stored language code or null if none is stored
   */
  getLanguage(): string | null

  /**
   * Sets the language to be stored.
   * @param language - The language code to store
   */
  setLanguage(language: string): void
}

/**
 * Configuration object for localization initialization.
 */
export interface LocalizationConfig {
  resources: Resource
  fallbackLng?: string
  compatibilityJSON?: 'v4'
  interpolation?: {
    escapeValue?: boolean
  }
  languageStore?: LanguageStore
}

/**
 * Type-safe translation path types
 * These types enable compile-time checking of translation keys
 */

/**
 * Primitive types that can be leaf values in translation objects
 */
export type Primitive = string | number | boolean | null | undefined

/**
 * Nested record type that allows deep nesting of translation objects
 */
export type NestedRecord = { [key: string]: Primitive | NestedRecord }

/**
 * Recursively generates all possible paths through a nested object structure.
 * Returns a union of string literal types representing dot-notation paths.
 *
 * @template T - The translation object type
 *
 * @example
 * ```typescript
 * type Translations = {
 *   common: { welcome: string; goodbye: string };
 *   user: { greeting: string };
 * };
 *
 * type Paths = Path<Translations>;
 * // Result: "common" | "common.welcome" | "common.goodbye" | "user" | "user.greeting"
 * ```
 */
export type PathImpl<T, K extends keyof T = keyof T> = K extends string | number
  ? T[K] extends Record<string, any>
    ? T[K] extends Primitive
      ? `${K}`
      : `${K}` | `${K}.${PathImpl<T[K]>}`
    : `${K}`
  : never

export type Path<T> = T extends Record<string, any> ? PathImpl<T> : never

/**
 * Extracts the value type at a given path in a nested object structure.
 *
 * @template T - The translation object type
 * @template P - The path string (e.g., "common.welcome")
 *
 * @example
 * ```typescript
 * type Translations = {
 *   common: { welcome: string; count: number };
 * };
 *
 * type WelcomeType = PathValue<Translations, "common.welcome">;
 * // Result: string
 *
 * type CountType = PathValue<Translations, "common.count">;
 * // Result: number
 * ```
 */
export type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never

/**
 * Extracts parameter names from a string literal type that contains interpolation placeholders.
 * Supports the default format: {{paramName}}
 *
 * @template S - The string literal type
 * @template Prefix - The interpolation prefix (default: "{{")
 * @template Suffix - The interpolation suffix (default: "}}")
 *
 * @example
 * ```typescript
 * type Params1 = ExtractParams<"Hello {{name}}!">;
 * // Result: { name: string | number }
 *
 * type Params2 = ExtractParams<"You have {{count}} points">;
 * // Result: { count: string | number }
 *
 * type Params3 = ExtractParams<"Hello {{name}}, you have {{count}} points">;
 * // Result: { name: string | number; count: string | number }
 *
 * type Params4 = ExtractParams<"No params here">;
 * // Result: {}
 * ```
 */
type ExtractParams<S extends string, Prefix extends string = '{{', Suffix extends string = '}}'> = S extends `${string}${Prefix}${infer Param}${Suffix}${infer Rest}`
  ? Param extends `${infer ParamName}`
    ? ParamName extends ''
      ? ExtractParams<Rest, Prefix, Suffix>
      : {
          [K in ParamName]: string | number
        } & ExtractParams<Rest, Prefix, Suffix>
    : ExtractParams<Rest, Prefix, Suffix>
  : {}

/**
 * Type for React component interpolation map
 * Supports both React elements and function components for react-i18next Trans
 */
export type ComponentMap = {
  [key: string]: React.ReactElement | ((props: { children?: React.ReactNode; [key: string]: any }) => React.ReactElement)
}

/**
 * Type-safe translation function that accepts only valid paths from the translation structure
 * and enforces type-safe parameters based on the translation string content.
 * Supports both string interpolation and React component interpolation.
 *
 * @template T - The translation object type
 *
 * @example
 * ```typescript
 * const translations = {
 *   common: { welcome: "Welcome" },
 *   user: { greeting: "Hello, {{name}}!" }
 * };
 *
 * type TranslateFn = TranslateFunction<typeof translations>;
 *
 * const t: TranslateFn = (key, params, components) => { ... };
 *
 * // String interpolation
 * t("common.welcome"); // ✅ Valid (no params needed) -> returns string
 * t("user.greeting", { name: "John" }); // ✅ Valid -> returns string
 * t("user.greeting", { wrong: "John" }); // ❌ TypeScript error
 * t("user.greeting"); // ❌ TypeScript error (name is required)
 *
 * // Component interpolation
 * t("user.greeting", { name: "John" }, { name: <strong>John</strong> }); // ✅ Valid -> returns JSX.Element
 * t("invalid.key"); // ❌ TypeScript error
 * ```
 */
export type TranslateFunction<T extends NestedRecord> = {
  // Overload 1: With components -> returns JSX.Element
  <K extends Path<T> & string>(
    key: K,
    params: PathValue<T, K> extends string
      ? ExtractParams<PathValue<T, K>> extends Record<string, never>
        ? Record<string, string | number> | undefined
        : ExtractParams<PathValue<T, K>>
      : Record<string, string | number> | undefined,
    components: ComponentMap
  ): React.JSX.Element

  // Overload 2: Without components -> returns string
  <K extends Path<T> & string>(
    key: K,
    ...args: PathValue<T, K> extends string
      ? ExtractParams<PathValue<T, K>> extends Record<string, never>
        ? [params?: Record<string, string | number>]
        : [params: ExtractParams<PathValue<T, K>>]
      : [params?: Record<string, string | number>]
  ): string
}
