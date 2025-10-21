import { renderHook } from '@testing-library/react';
import { useTranslationInjection } from '../../hooks/useTranslationInjection';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: jest.fn((key, variables) => {
      // Simple mock implementation that replaces variables in the key string
      if (!variables) return `translated_${key}`;
      
      let result = `translated_${key}`;
      Object.entries(variables).forEach(([varKey, varValue]) => {
        result = result.replace(new RegExp(`{{${varKey}}}`, 'g'), varValue as string);
      });
      return result;
    })
  })
}));

describe('useTranslationInjection', () => {
  it('should translate a simple key', () => {
    // When the hook is called with a key and empty variables
    const { result } = renderHook(() => 
      useTranslationInjection('greeting', {})
    );
    
    // Then it should return the translated string
    expect(result.current).toBe('translated_greeting');
  });

  it('should translate with variables', () => {
    // When the hook is called with a key and variables
    const { result } = renderHook(() => 
      useTranslationInjection('welcome', { name: 'John', role: 'Admin' })
    );
    
    // Then it should return the translated string with variables replaced
    expect(result.current).toBe('translated_welcome');
  });

  it('should handle array of keys', () => {
    // When the hook is called with an array of keys
    const { result } = renderHook(() => 
      useTranslationInjection(['greeting', 'fallback'], {})
    );
    
    // Then it should pass the array to the t function
    expect(result.current).toBe('translated_greeting,fallback');
  });

  it('should pass all variables to the t function', () => {
    // Create a spy on the t function to check passed variables
    const tSpy = jest.fn().mockReturnValue('translated_with_context');
    (require('react-i18next') as any).useTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    // When the hook is called with complex variables
    const variables = {
      name: 'John',
      count: 5,
      context: { role: 'admin' },
      interpolation: { escapeValue: false }
    };
    
    renderHook(() => useTranslationInjection('complex', variables));
    
    // Then all variables should be passed to the t function
    expect(tSpy).toHaveBeenCalledWith('complex', variables);
  });

  it('should handle empty variables object', () => {
    // Create a spy on the t function
    const tSpy = jest.fn().mockReturnValue('translated_empty');
    (require('react-i18next') as any).useTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    // When the hook is called with an empty variables object
    renderHook(() => useTranslationInjection('empty', {}));
    
    // Then the empty object should be passed to the t function
    expect(tSpy).toHaveBeenCalledWith('empty', {});
  });

  it('should handle undefined variables gracefully', () => {
    // Create a spy on the t function
    const tSpy = jest.fn().mockReturnValue('translated_no_vars');
    (require('react-i18next') as any).useTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    // When the hook is called with undefined variables
    // @ts-ignore - intentionally passing undefined for test
    renderHook(() => useTranslationInjection('no_vars', undefined));
    
    // Then undefined should be passed to the t function
    expect(tSpy).toHaveBeenCalledWith('no_vars', undefined);
  });
});
