import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../hooks/useTranslation';

const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

// Mock translation object for testing
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

  it('should return a proxy object with type-safe access', () => {
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>(mockTranslationObject));
    
    expect(typeof result.current).toBe('object');
    expect(result.current).not.toBeNull();
  });

  it('should translate nested keys correctly using dot notation access', () => {
    const tSpy = jest.fn((key) => `translated_${key}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>(mockTranslationObject));
    
    // Access nested properties
    const hello = result.current.common.hello;
    const welcome = result.current.common.welcome;
    const login = result.current.auth.login;
    
    expect(hello).toBe('translated_common.hello');
    expect(welcome).toBe('translated_common.welcome');
    expect(login).toBe('translated_auth.login');
    
    expect(tSpy).toHaveBeenCalledWith('common.hello');
    expect(tSpy).toHaveBeenCalledWith('common.welcome');
    expect(tSpy).toHaveBeenCalledWith('auth.login');
  });

  it('should handle deeply nested objects', () => {
    const tSpy = jest.fn((key) => `translated_${key}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>(mockTranslationObject));
    
    const deepValue = result.current.nested.deep.value;
    
    expect(deepValue).toBe('translated_nested.deep.value');
    expect(tSpy).toHaveBeenCalledWith('nested.deep.value');
  });

  it('should return nested proxy objects for object properties', () => {
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>(mockTranslationObject));
    
    // Accessing an object property should return another proxy
    const commonProxy = result.current.common;
    const authProxy = result.current.auth;
    
    expect(typeof commonProxy).toBe('object');
    expect(typeof authProxy).toBe('object');
    expect(commonProxy).not.toBeNull();
    expect(authProxy).not.toBeNull();
  });

  it('should handle translation errors gracefully', () => {
    const errorT = jest.fn().mockImplementation(() => {
      throw new Error('Translation error');
    });
    
    mockUseTranslation.mockReturnValue({
      t: errorT
    });
    
    const { result } = renderHook(() => useTranslation<typeof mockTranslationObject>(mockTranslationObject));
    
    expect(() => result.current.common.hello).toThrow('Translation error');
  });

  it('should work with different translation object structures', () => {
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
    
    const { result } = renderHook(() => useTranslation<typeof customTranslationObject>(customTranslationObject));
    
    const saveButton = result.current.buttons.save;
    const errorMessage = result.current.messages.error;
    
    expect(saveButton).toBe('custom_buttons.save');
    expect(errorMessage).toBe('custom_messages.error');
    
    expect(tSpy).toHaveBeenCalledWith('buttons.save');
    expect(tSpy).toHaveBeenCalledWith('messages.error');
  });

  it('should handle empty translation objects', () => {
    const emptyTranslationObject = {};
    
    const tSpy = jest.fn((key) => `empty_${key}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation<typeof emptyTranslationObject>(emptyTranslationObject));
    
    // Should still work even with empty objects - accessing any key should return translation
    const someKey = (result.current as any).nonexistent;
    
    expect(someKey).toBe('empty_nonexistent');
    expect(tSpy).toHaveBeenCalledWith('nonexistent');
  });
});
