import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '../../hooks/useLanguage';

// Mock react-i18next
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

describe('useLanguage', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
    
    // Reset the i18n mock
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: 'en',
        options: {
          resources: {
            en: { translation: {} },
            fr: { translation: {} },
            es: { translation: {} }
          }
        },
        changeLanguage: jest.fn().mockResolvedValue(undefined)
      }
    });
  });

  it('should return the current language', () => {
    // When the hook is called
    const { result } = renderHook(() => useLanguage());
    
    // Then it should return the current language
    expect(result.current.currentLanguage).toBe('en');
  });

  it('should return available languages', () => {
    // When the hook is called
    const { result } = renderHook(() => useLanguage());
    
    // Then it should return the available languages
    expect(result.current.availableLanguages).toEqual(['en', 'fr', 'es']);
  });

  it('should change the language when changeLanguage is called', async () => {
    // Given the hook is rendered with a mock changeLanguage function
    const mockChangeLanguage = jest.fn().mockResolvedValue(undefined);
    
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: 'en',
        options: {
          resources: {
            en: { translation: {} },
            fr: { translation: {} },
            es: { translation: {} }
          }
        },
        changeLanguage: mockChangeLanguage
      }
    });
    
    const { result } = renderHook(() => useLanguage());
    
    // When changeLanguage is called
    await act(async () => {
      await result.current.changeLanguage('fr');
    });
    
    // Then i18n.changeLanguage should be called with the new language
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });

  it('should handle empty resources gracefully', () => {
    // Given i18n with no resources
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: 'en',
        options: {
          resources: undefined
        },
        changeLanguage: jest.fn().mockResolvedValue(undefined)
      }
    });
    
    // When the hook is called
    const { result } = renderHook(() => useLanguage());
    
    // Then it should return an empty array of available languages
    expect(result.current.availableLanguages).toEqual([]);
  });

  it('should maintain the changeLanguage reference between renders', () => {
    // Given the hook is rendered
    const { result, rerender } = renderHook(() => useLanguage());
    
    // Store the initial reference to changeLanguage
    const initialChangeLanguage = result.current.changeLanguage;
    
    // When the hook is rerendered
    rerender();
    
    // Then the changeLanguage reference should remain the same
    expect(result.current.changeLanguage).toBe(initialChangeLanguage);
  });

  it('should handle language change errors gracefully', async () => {
    // Given i18n.changeLanguage that rejects
    const error = new Error('Language change failed');
    const mockChangeLanguage = jest.fn().mockRejectedValueOnce(error);
    
    // Update the mock to use our implementation
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: 'en',
        options: {
          resources: {
            en: { translation: {} },
            fr: { translation: {} },
            es: { translation: {} }
          }
        },
        changeLanguage: mockChangeLanguage
      }
    });
    
    // Given the hook is rendered
    const { result } = renderHook(() => useLanguage());
    
    // When changeLanguage is called
    let caughtError;
    await act(async () => {
      try {
        await result.current.changeLanguage('invalid-lang');
      } catch (e) {
        caughtError = e;
      }
    });
    
    // Then the error should be propagated
    expect(caughtError).toBe(error);
    
    // And i18n.changeLanguage should still have been called
    expect(mockChangeLanguage).toHaveBeenCalledWith('invalid-lang');
  });
});
