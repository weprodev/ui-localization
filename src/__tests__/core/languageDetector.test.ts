import { createLanguageDetectorPlugin } from '../../core/languageDetector';
import { MockLanguageStore } from '../__mocks__/mocks';

describe('languageDetector', () => {
  let mockLanguageStore: MockLanguageStore;
  let languageDetector: ReturnType<typeof createLanguageDetectorPlugin>;
  let callbackMock: jest.Mock;

  beforeEach(() => {
    mockLanguageStore = new MockLanguageStore();
    languageDetector = createLanguageDetectorPlugin(mockLanguageStore);
    callbackMock = jest.fn();
  });

  describe('detect', () => {
    it('should return the stored language when available', () => {
      // Given a stored language
      mockLanguageStore.setLanguage('fr');
      
      // When detect is called
      languageDetector.detect(callbackMock);
      
      // Then the callback should be called with the stored language
      expect(callbackMock).toHaveBeenCalledWith('fr');
    });

    it('should return default language "en" when no language is stored', () => {
      // Given no stored language
      
      // When detect is called
      languageDetector.detect(callbackMock);
      
      // Then the callback should be called with the default language
      expect(callbackMock).toHaveBeenCalledWith('en');
    });

    it('should handle errors and return default language "en"', () => {
      // Given a language store that throws an error
      const errorStore = {
        getLanguage: jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        }),
        setLanguage: jest.fn()
      };
      
      const errorDetector = createLanguageDetectorPlugin(errorStore);
      
      // When detect is called
      errorDetector.detect(callbackMock);
      
      // Then the callback should be called with the default language
      expect(callbackMock).toHaveBeenCalledWith('en');
    });
  });

  describe('cacheUserLanguage', () => {
    it('should store the provided language', () => {
      // Given a language
      const language = 'es';
      
      // When cacheUserLanguage is called
      languageDetector.cacheUserLanguage(language);
      
      // Then the language should be stored
      expect(mockLanguageStore.getLanguage()).toBe(language);
    });

    it('should silently handle errors', () => {
      // Given a language store that throws an error on setLanguage
      const errorStore = {
        getLanguage: jest.fn(),
        setLanguage: jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        })
      };
      
      const errorDetector = createLanguageDetectorPlugin(errorStore);
      
      // When cacheUserLanguage is called
      // Then no error should be thrown
      expect(() => {
        errorDetector.cacheUserLanguage('de');
      }).not.toThrow();
    });
  });

  describe('plugin structure', () => {
    it('should have the correct plugin structure', () => {
      expect(languageDetector).toEqual(expect.objectContaining({
        type: 'languageDetector',
        async: false,
        init: expect.any(Function),
        detect: expect.any(Function),
        cacheUserLanguage: expect.any(Function)
      }));
    });

    it('should have an init method that does nothing', () => {
      // The init method should exist but not do anything
      expect(() => languageDetector.init()).not.toThrow();
    });
  });
});
