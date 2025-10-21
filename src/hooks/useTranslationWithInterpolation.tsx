import React, { useMemo, ReactElement, JSX } from 'react';
import { Trans } from 'react-i18next';

type Variables = { [key: string]: any };
type Components = { [key: string]: ReactElement };

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