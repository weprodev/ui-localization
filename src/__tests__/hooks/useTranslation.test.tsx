import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../hooks/useTranslation';

const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

describe('useTranslation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTranslation.mockReturnValue({
      t: jest.fn((key) => `translated_${key}`)
    });
  });

  it('should return the translation function', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(typeof result.current).toBe('function');
  });

  it('should translate keys correctly', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current('common.hello')).toBe('translated_common.hello');
    expect(result.current('common.welcome')).toBe('translated_common.welcome');
  });

  it('should pass through the key to the translation function', () => {
    const tSpy = jest.fn().mockReturnValue('translated_value');
    mockUseTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation());
    result.current('test.key');
    
    expect(tSpy).toHaveBeenCalledWith('test.key');
  });

  it('should handle different parameter types', () => {
    const tSpy = jest.fn().mockReturnValue('translated_value');
    mockUseTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    const { result } = renderHook(() => useTranslation());
    
    result.current('simple.key');
    expect(tSpy).toHaveBeenCalledWith('simple.key');
    
    result.current(['key1', 'key2']);
    expect(tSpy).toHaveBeenCalledWith(['key1', 'key2']);
    
    result.current('key', { count: 5 });
    expect(tSpy).toHaveBeenCalledWith('key', { count: 5 });
  });

  it('should handle translation errors gracefully', () => {
    const errorT = jest.fn().mockImplementation(() => {
      throw new Error('Translation error');
    });
    
    mockUseTranslation.mockReturnValueOnce({
      t: errorT
    });
    
    const { result } = renderHook(() => useTranslation());
    
    expect(() => result.current('error.key')).toThrow('Translation error');
  });

  it('should maintain function reference between renders', () => {
    const { result, rerender } = renderHook(() => useTranslation());
    const firstT = result.current;
    
    rerender();
    
    expect(result.current).toBe(firstT);
  });
});
