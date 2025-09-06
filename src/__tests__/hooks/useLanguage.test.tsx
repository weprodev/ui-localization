import { renderHook, act } from '@testing-library/react';
import useLanguage from '../../hooks/useLanguage';
import i18n from 'i18next';

// Mock i18next
jest.mock('i18next', () => ({
  language: 'en',
  options: {
    resources: {
      en: { translation: {} },
      fr: { translation: {} },
      es: { translation: {} }
    }
  },
  changeLanguage: jest.fn().mockImplementation((lang) => {
    // Update the language property to simulate language change
    (i18n as any).language = lang;
    return Promise.resolve();
  })
}));

describe('useLanguage', () => {
  beforeEach(() => {
    // Reset the language to 'en' before each test
    (i18n as any).language = 'en';
    jest.clearAllMocks();
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
    // Given the hook is rendered
    const { result, rerender } = renderHook(() => useLanguage());
    
    // When changeLanguage is called
    await act(async () => {
      await result.current.changeLanguage('fr');
    });
    
    // Then i18n.changeLanguage should be called with the new language
    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr');
    
    // We need to rerender to get the updated state since the hook uses i18n.language directly
    rerender();
    
    // And the current language should be updated
    expect(result.current.currentLanguage).toBe('fr');
  });

  it('should handle empty resources gracefully', () => {
    // Given i18n with no resources
    const originalResources = i18n.options.resources;
    (i18n.options as any).resources = undefined;
    
    // When the hook is called
    const { result } = renderHook(() => useLanguage());
    
    // Then it should return an empty array of available languages
    expect(result.current.availableLanguages).toEqual([]);
    
    // Restore resources for other tests
    (i18n.options as any).resources = originalResources;
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
    (i18n.changeLanguage as jest.Mock).mockRejectedValueOnce(error);
    
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
    expect(i18n.changeLanguage).toHaveBeenCalledWith('invalid-lang');
  });
});
