import React, { useMemo, ReactElement, JSX } from 'react';
import { Trans } from 'react-i18next';

type Variables = { [key: string]: any };
type Components = { [key: string]: ReactElement };

/**
 * Hook for translation with component interpolation.
 * 
 * @param key - Translation key
 * @param variables - Variables to inject into the translation
 * @param components - React components to interpolate
 * @returns JSX element with translated content and interpolated components
 */
export const useTranslationWithInterpolation = (
  key: string,
  variables: Variables = {},
  components: Components = {}
): JSX.Element => {
  return useMemo(
    () => <Trans i18nKey={key} values={variables} components={components} />,
    [key, variables, components]
  );
};