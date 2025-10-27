import { renderHook } from '@testing-library/react';
import { useTranslationFallback } from '../../hooks/useTranslationFallback';

const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

describe('useTranslationFallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTranslation.mockReturnValue({
      t: jest.fn((key) => `translated_${key}`)
    });
  });

  it('should return the raw i18next translation function', () => {
    const { result } = renderHook(() => useTranslationFallback());
    
    expect(typeof result.current).toBe('function');
  });

  it('should translate keys correctly using standard i18next syntax', () => {
    const tSpy = jest.fn((key) => `translated_${key}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslationFallback());
    
    expect(result.current('common.hello')).toBe('translated_common.hello');
    expect(result.current('common.welcome')).toBe('translated_common.welcome');
    
    expect(tSpy).toHaveBeenCalledWith('common.hello');
    expect(tSpy).toHaveBeenCalledWith('common.welcome');
  });

  it('should handle translation with variables', () => {
    const tSpy = jest.fn((key, options) => `translated_${key}_${JSON.stringify(options)}`);
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslationFallback());
    
    const variables = { name: 'John', count: 5 };
    result.current('greeting', variables);
    
    expect(tSpy).toHaveBeenCalledWith('greeting', variables);
  });

  it('should handle different parameter types like standard i18next', () => {
    const tSpy = jest.fn().mockReturnValue('translated_value');
    mockUseTranslation.mockReturnValue({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslationFallback());
    
    // String key
    result.current('simple.key');
    expect(tSpy).toHaveBeenCalledWith('simple.key');
    
    // Array of keys
    result.current(['key1', 'key2']);
    expect(tSpy).toHaveBeenCalledWith(['key1', 'key2']);
    
    // Key with options
    result.current('key', { count: 5 });
    expect(tSpy).toHaveBeenCalledWith('key', { count: 5 });
  });

  it('should handle translation errors gracefully', () => {
    const errorT = jest.fn().mockImplementation(() => {
      throw new Error('Translation error');
    });
    
    mockUseTranslation.mockReturnValue({
      t: errorT
    });
    
    const { result } = renderHook(() => useTranslationFallback());
    
    expect(() => result.current('error.key')).toThrow('Translation error');
  });

  it('should return the same function reference between renders', () => {
    const { result, rerender } = renderHook(() => useTranslationFallback());
    const firstT = result.current;
    
    rerender();
    
    expect(result.current).toBe(firstT);
  });

  it('should work exactly like the raw i18next t function', () => {
    const mockT = jest.fn((key, options) => `mock_${key}_${JSON.stringify(options || {})}`);
    mockUseTranslation.mockReturnValue({
      t: mockT
    });
    
    const { result } = renderHook(() => useTranslationFallback());
    
    // Should be the exact same function
    expect(result.current).toBe(mockT);
    
    // Should behave identically
    const testKey = 'test.key';
    const testOptions = { interpolation: { escapeValue: false } };
    
    const hookResult = result.current(testKey, testOptions);
    const directResult = mockT(testKey, testOptions);
    
    expect(hookResult).toBe(directResult);
  });
});
