import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../hooks/useTranslation';


// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: jest.fn((key) => `translated_${key}`)
  })
}));

describe('useTranslation', () => {
  it('should return the translation function', () => {
    // When the hook is called
    const { result } = renderHook(() => useTranslation());
    
    // Then it should return the translation function
    expect(typeof result.current).toBe('function');
  });

  it('should translate keys correctly', () => {
    // When the hook is called
    const { result } = renderHook(() => useTranslation());
    
    // Then it should translate keys correctly
    expect(result.current('common.hello')).toBe('translated_common.hello');
    expect(result.current('common.welcome')).toBe('translated_common.welcome');
  });

  it('should pass through the key to the translation function', () => {
    // Create a spy on the t function
    const tSpy = jest.fn().mockReturnValue('translated_value');
    (require('react-i18next') as any).useTranslation.mockReturnValueOnce({
      t: tSpy
    });
    
    // When the hook is called
    const { result } = renderHook(() => useTranslation());
    result.current('test.key');
    
    // Then the key should be passed to the t function
    expect(tSpy).toHaveBeenCalledWith('test.key');
  });
});
