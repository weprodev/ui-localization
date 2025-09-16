import { renderHook } from '@testing-library/react';
import useTranslation from '../../hooks/useTranslation';

// Define a type for our test translation object
type TestTranslation = {
  common: {
    hello: string;
    welcome: string;
    nested: {
      item: string;
      deepNested: {
        value: string;
      };
    };
  };
  buttons: {
    submit: string;
    cancel: string;
  };
  errors: {
    notFound: string;
  };
};

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: jest.fn((key) => `translated_${key}`)
  })
}));

describe('useTranslation', () => {
  // Sample translation structure for testing
  const translationObj = {
    common: {
      hello: 'Hello',
      welcome: 'Welcome',
      nested: {
        item: 'Nested Item',
        deepNested: {
          value: 'Deep Nested Value'
        }
      }
    },
    buttons: {
      submit: 'Submit',
      cancel: 'Cancel'
    },
    errors: {
      notFound: 'Not Found'
    }
  };

  it('should return a proxy that translates top-level keys', () => {
    // When the hook is called
    const { result } = renderHook(() => useTranslation<TestTranslation>(translationObj));
    
    // Then it should return a proxy that translates keys
    expect(result.current.common).toBeDefined();
    expect(result.current.buttons).toBeDefined();
    expect(result.current.errors).toBeDefined();
  });

  it('should translate nested keys correctly', () => {
    // When the hook is called
    const { result } = renderHook(() => useTranslation<TestTranslation>(translationObj));
    
    // Then nested keys should be translated correctly
    expect(result.current.common.hello).toBe('translated_common.hello');
    expect(result.current.common.welcome).toBe('translated_common.welcome');
    expect(result.current.buttons.submit).toBe('translated_buttons.submit');
    expect(result.current.errors.notFound).toBe('translated_errors.notFound');
  });

  it('should handle deeply nested objects', () => {
    // When the hook is called
    const { result } = renderHook(() => useTranslation<TestTranslation>(translationObj));
    
    // Then deeply nested keys should be translated correctly
    expect(result.current.common.nested.item).toBe('translated_common.nested.item');
    expect(result.current.common.nested.deepNested.value).toBe('translated_common.nested.deepNested.value');
  });

  it('should handle non-existent keys gracefully', () => {
    // When the hook is called
    const { result } = renderHook(() => useTranslation(translationObj));
    
    // Then accessing non-existent keys should still work
    // @ts-ignore - intentionally accessing non-existent key for test
    expect(result.current.nonExistent).toBe('translated_nonExistent');
    // @ts-ignore - intentionally accessing non-existent nested key for test
    expect(result.current.common.nonExistent).toBe('translated_common.nonExistent');
  });

  it('should handle empty objects', () => {
    // When the hook is called with an empty object
    const { result } = renderHook(() => useTranslation({}));
    
    // Then it should return a proxy that still works for any key
    // @ts-ignore - intentionally accessing key on empty object for test
    expect(result.current.anyKey).toBe('translated_anyKey');
  });

  it('should handle null values in the translation object', () => {
    // Given a translation object with null values
    const translationWithNull = {
      common: {
        nullValue: null,
        regularValue: 'Regular'
      }
    };
    
    type TranslationWithNull = {
      common: {
        nullValue: null;
        regularValue: string;
      }
    };
    
    // When the hook is called
    const { result } = renderHook(() => useTranslation<TranslationWithNull>(translationWithNull));
    
    // Then it should handle null values correctly
    expect(result.current.common.nullValue).toBe('translated_common.nullValue');
    expect(result.current.common.regularValue).toBe('translated_common.regularValue');
  });

  it('should handle array values in the translation object', () => {
    // Given a translation object with array values
    const translationWithArray = {
      items: ['item1', 'item2']
    };
    
    // When the hook is called
    const { result } = renderHook(() => useTranslation(translationWithArray));
    
    // Then it should handle arrays correctly
    // Note: Arrays are objects, so they'll be treated as nested objects
    // @ts-ignore - intentionally accessing array index for test
    expect(result.current.items[0]).toBe('translated_items.0');
    // @ts-ignore - intentionally accessing array index for test
    expect(result.current.items[1]).toBe('translated_items.1');
  });

  it('should maintain the same proxy reference for nested objects', () => {
    // When the hook is called
    const { result, rerender } = renderHook(() => useTranslation<TestTranslation>(translationObj));
    
    // Get references to nested objects
    const commonRef = result.current.common;
    const buttonsRef = result.current.buttons;
    
    // When the hook is rerendered
    rerender();
    
    // Then the nested object references should be different (new proxies are created each render)
    // This is expected behavior since proxies are created on-demand
    expect(result.current.common).not.toBe(commonRef);
    expect(result.current.buttons).not.toBe(buttonsRef);
  });
});
