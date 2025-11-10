import { renderHook } from '@testing-library/react';
import { useTranslationInjection } from '../../hooks/useTranslationInjection';

const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

describe('useTranslationInjection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTranslation.mockReturnValue({
      t: jest.fn((key, variables) => {
        if (Array.isArray(key)) {
          return `translated_${key.join(',')}`;
        }
        
        if (!variables) return `translated_${key}`;
        
        let result = `translated_${key}`;
        Object.entries(variables).forEach(([varKey, varValue]) => {
          if (typeof varValue === 'string') {
            result = result.replace(new RegExp(`{{${varKey}}}`, 'g'), varValue);
          }
        });
        return result;
      })
    });
  });

  it('should translate a simple key', () => {
    const { result } = renderHook(() => 
      useTranslationInjection('greeting', {})
    );
    
    expect(result.current).toBe('translated_greeting');
  });

  it('should translate with variables', () => {
    const { result } = renderHook(() => 
      useTranslationInjection('welcome {{name}}', { name: 'John' })
    );
    
    expect(result.current).toBe('translated_welcome John');
  });

  it('should handle array of keys', () => {
    const { result } = renderHook(() => 
      useTranslationInjection(['greeting', 'fallback'], {})
    );
    
    expect(result.current).toBe('translated_greeting,fallback');
  });

  it('should pass all variables to the t function', () => {
    const tSpy = jest.fn().mockReturnValue('translated_with_context');
    mockUseTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    const variables = {
      name: 'John',
      count: 5,
      context: { role: 'admin' },
      interpolation: { escapeValue: false }
    };
    
    renderHook(() => useTranslationInjection('complex', variables));
    
    expect(tSpy).toHaveBeenCalledWith('complex', variables);
  });

  it('should handle empty variables object', () => {
    const tSpy = jest.fn().mockReturnValue('translated_empty');
    mockUseTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    renderHook(() => useTranslationInjection('empty', {}));
    
    expect(tSpy).toHaveBeenCalledWith('empty', {});
  });

  it('should handle undefined variables gracefully', () => {
    const tSpy = jest.fn().mockReturnValue('translated_no_vars');
    mockUseTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    renderHook(() => useTranslationInjection('no_vars', undefined as any));
    
    expect(tSpy).toHaveBeenCalledWith('no_vars', undefined);
  });
});
