import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '../../hooks/useLanguage';

const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

describe('useLanguage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
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
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.currentLanguage).toBe('en');
  });

  it('should return available languages', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.availableLanguages).toEqual(['en', 'fr', 'es']);
  });

  it('should change the language when changeLanguage is called', async () => {
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
    
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.availableLanguages).toEqual([]);
  });

  it('should maintain the changeLanguage reference between renders', () => {
    const { result, rerender } = renderHook(() => useLanguage());
    
    const initialChangeLanguage = result.current.changeLanguage;
    
    rerender();
    
    expect(result.current.changeLanguage).toBe(initialChangeLanguage);
  });

  it('should handle language change errors gracefully', async () => {
    const error = new Error('Language change failed');
    const mockChangeLanguage = jest.fn().mockRejectedValueOnce(error);
    
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

  it('should prioritize resolvedLanguage over language', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: 'fr',
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
    
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.currentLanguage).toBe('fr');
  });

  it('should handle undefined i18n.options', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: 'en',
        options: undefined,
        changeLanguage: jest.fn().mockResolvedValue(undefined)
      }
    });
    
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.availableLanguages).toEqual([]);
  });

  it('should handle null resolvedLanguage', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: null,
        options: {
          resources: {
            en: { translation: {} },
            fr: { translation: {} }
          }
        },
        changeLanguage: jest.fn().mockResolvedValue(undefined)
      }
    });
    
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.currentLanguage).toBe('en');
  });

  it('should update dependency array when availableLanguages change', () => {
    const { result, rerender } = renderHook(() => useLanguage());
    const initialChangeLanguage = result.current.changeLanguage;
    
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        resolvedLanguage: 'en',
        options: {
          resources: {
            en: { translation: {} },
            fr: { translation: {} },
            es: { translation: {} },
            de: { translation: {} }
          }
        },
        changeLanguage: jest.fn().mockResolvedValue(undefined)
      }
    });
    
    rerender();
    
    expect(result.current.changeLanguage).not.toBe(initialChangeLanguage);
    expect(result.current.availableLanguages).toEqual(['en', 'fr', 'es', 'de']);
  });
});
