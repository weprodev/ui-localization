import React, { useMemo, ReactElement, JSX } from 'react';
import { useTranslation, Trans } from 'react-i18next';

type Variables = { [key: string]: any };
type Components = { [key: string]: ReactElement };

const useTranslateWithInterpolation = (
  key: string,
  variables: Variables = {},
  components: Components = {}
): JSX.Element => {
  const { t } = useTranslation();

  return useMemo(
    () => <Trans i18nKey={key} values={variables} components={components} />,
    [t, key, variables, components]
  );
};

export default useTranslateWithInterpolation;
