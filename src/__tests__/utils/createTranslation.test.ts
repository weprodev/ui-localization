import React from 'react';
import i18n from 'i18next';
import { createTranslation } from '../../utils/createTranslation';
import { Trans } from 'react-i18next';

// Mock i18next
jest.mock('i18next', () => ({
  t: jest.fn(),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  Trans: jest.fn(() => null), 
}));

const mockTranslationObject = {
  common: {
    hello: 'Hello',
    welcome: 'Welcome {{name}}',
  },
  nested: {
    key: 'Value'
  }
};

describe('createTranslation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a translation function', () => {
    const t = createTranslation<typeof mockTranslationObject>();
    expect(typeof t).toBe('function');
  });

  it('should call i18n.t and return string when no components provided', () => {
    (i18n.t as unknown as jest.Mock).mockReturnValue('Translated String');
    const t = createTranslation<typeof mockTranslationObject>();

    const result = t('common.hello');

    expect(i18n.t).toHaveBeenCalledWith('common.hello', undefined);
    expect(result).toBe('Translated String');
  });

  it('should call i18n.t with params', () => {
    (i18n.t as unknown as jest.Mock).mockReturnValue('Hello John');
    const t = createTranslation<typeof mockTranslationObject>();

    const result = t('common.welcome', { name: 'John' });

    expect(i18n.t).toHaveBeenCalledWith('common.welcome', { name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('should convert non-string results to string', () => {
    (i18n.t as unknown as jest.Mock).mockReturnValue(12345);
    const t = createTranslation<typeof mockTranslationObject>();

    const result = t('common.hello');

    expect(i18n.t).toHaveBeenCalledWith('common.hello', undefined);
    expect(result).toBe('12345');
  });

  it('should return React element (Trans) when components are provided', () => {
    const t = createTranslation<typeof mockTranslationObject>();
    const components = { b: React.createElement('b') };
    const params = { name: 'John' };

    const result = t('common.welcome', params, components);

    expect(React.isValidElement(result)).toBe(true);
    
    // Verify it created a Trans element with correct props
    const element = result as React.ReactElement;
    expect(element.type).toBe(Trans);
    expect(element.props.i18nKey).toBe('common.welcome');
    expect(element.props.values).toBe(params);
    expect(element.props.components).toBe(components);
  });
});
