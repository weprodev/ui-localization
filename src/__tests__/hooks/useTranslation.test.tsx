import React from 'react';
import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../hooks/useTranslation';

const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
  Trans: ({ i18nKey, values, components }: any) => 
    React.createElement('span', { 'data-testid': 'trans', 'data-key': i18nKey }, 
      `Translated: ${i18nKey}`, 
      values && JSON.stringify(values),
      components && ' [with components]'
    )
}));

// Mock translation object for testing type safety
const mockTranslationObject = {
  common: {
    hello: 'Hello',
    welcome: 'Welcome',
    goodbye: 'Goodbye'
  },
  auth: {
    login: 'Login',
    signup: 'Sign Up'
  },
  nested: {
    deep: {
      value: 'Deep Value'
    }
  }
};

describe('useTranslation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTranslation.mockReturnValue({
      t: jest.fn((key) => `translated_${key}`)
    });
  });

  it('should return an object with t function', () => {
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>());
    
    expect(typeof result.current).toBe('object');
    expect(result.current).not.toBeNull();
    expect(typeof result.current.t).toBe('function');
  });

  it('should translate nested keys correctly using type-safe t function', () => {
    const tSpy = jest.fn((key) => `translated_${key}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>());
    
    // Use type-safe t function
    const hello = result.current.t('common.hello');
    const welcome = result.current.t('common.welcome');
    const login = result.current.t('auth.login');
    
    expect(hello).toBe('translated_common.hello');
    expect(welcome).toBe('translated_common.welcome');
    expect(login).toBe('translated_auth.login');
    
    expect(tSpy).toHaveBeenCalledWith('common.hello', undefined);
    expect(tSpy).toHaveBeenCalledWith('common.welcome', undefined);
    expect(tSpy).toHaveBeenCalledWith('auth.login', undefined);
  });

  it('should handle deeply nested objects with type-safe t function', () => {
    const tSpy = jest.fn((key) => `translated_${key}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>());
    
    const deepValue = result.current.t('nested.deep.value');
    
    expect(deepValue).toBe('translated_nested.deep.value');
    expect(tSpy).toHaveBeenCalledWith('nested.deep.value', undefined);
  });

  it('should handle translation errors gracefully with t function', () => {
    const errorT = jest.fn().mockImplementation(() => {
      throw new Error('Translation error');
    });
    
    mockUseTranslation.mockReturnValue({
      t: errorT
    });
    
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>());
    
    expect(() => result.current.t('common.hello')).toThrow('Translation error');
  });

  it('should work with different translation object structures using t function', () => {
    const customTranslationObject = {
      buttons: {
        save: 'Save',
        cancel: 'Cancel'
      },
      messages: {
        success: 'Success',
        error: 'Error'
      }
    };
    
    const tSpy = jest.fn((key) => `custom_${key}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof customTranslationObject>());
    
    const saveButton = result.current.t('buttons.save');
    const errorMessage = result.current.t('messages.error');
    
    expect(saveButton).toBe('custom_buttons.save');
    expect(errorMessage).toBe('custom_messages.error');
    
    expect(tSpy).toHaveBeenCalledWith('buttons.save', undefined);
    expect(tSpy).toHaveBeenCalledWith('messages.error', undefined);
  });


  it('should support interpolation with t function', () => {
    const tSpy = jest.fn((key, params) => {
      if (params) {
        return `translated_${key}_${JSON.stringify(params)}`;
      }
      return `translated_${key}`;
    });
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>());
    
    const greeting = result.current.t('common.hello', { name: 'John' });
    
    expect(greeting).toContain('translated_common.hello');
    expect(tSpy).toHaveBeenCalledWith('common.hello', { name: 'John' });
  });

  it('should support type-safe params for translations with placeholders', () => {
    const translationWithParams = {
      user: {
        greeting: 'Hello {{name}}!',
        points: 'You have {{count}} points',
        message: 'Hello {{name}}, you have {{count}} points'
      },
      common: {
        welcome: 'Welcome'
      }
    };

    const tSpy = jest.fn((key, params) => {
      if (params) {
        return `translated_${key}_${JSON.stringify(params)}`;
      }
      return `translated_${key}`;
    });
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof translationWithParams>());
    
    // Test single param
    const greeting = result.current.t('user.greeting', { name: 'John' });
    expect(greeting).toContain('translated_user.greeting');
    expect(tSpy).toHaveBeenCalledWith('user.greeting', { name: 'John' });
    
    // Test number param
    const points = result.current.t('user.points', { count: 42 });
    expect(points).toContain('translated_user.points');
    expect(tSpy).toHaveBeenCalledWith('user.points', { count: 42 });
    
    // Test multiple params
    const message = result.current.t('user.message', { name: 'Alice', count: 10 });
    expect(message).toContain('translated_user.message');
    expect(tSpy).toHaveBeenCalledWith('user.message', { name: 'Alice', count: 10 });
    
    // Test translation without params (should work without params argument)
    const welcome = result.current.t('common.welcome');
    expect(welcome).toBe('translated_common.welcome');
    expect(tSpy).toHaveBeenCalledWith('common.welcome', undefined);
  });

  it('should support component interpolation with t function', () => {
    const translationWithComponents = {
      user: {
        greeting: 'Hello {{name}}!',
        welcome: 'Welcome <strong>{{name}}</strong>!'
      }
    };

    mockUseTranslation.mockReturnValue({
      t: jest.fn((key) => `translated_${key}`)
    });
    
    const { result } = renderHook(() => useTranslation<typeof translationWithComponents>());
    
    const components = {
      strong: React.createElement('strong', { className: 'highlight' })
    };
    
    const greeting = result.current.t('user.greeting', { name: 'John' }, components);
    
    expect(React.isValidElement(greeting)).toBe(true);
  });
});
