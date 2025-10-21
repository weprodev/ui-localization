import { createLanguageDetector } from '../../core/languageDetector';
import { MockLanguageStore } from '../__mocks__/mocks';

describe('languageDetector', () => {
  let mockLanguageStore: MockLanguageStore;
  let languageDetector: ReturnType<typeof createLanguageDetector>;

  beforeEach(() => {
    mockLanguageStore = new MockLanguageStore();
    languageDetector = createLanguageDetector(mockLanguageStore);
  });

  describe('detect', () => {
    it('should return the stored language when available', () => {
      // Given a stored language
      mockLanguageStore.setLanguage('fr');
      
      // When detect is called
      const result = languageDetector.detect();
      
      // Then it should return the stored language
      expect(result).toBe('fr');
    });

    it('should return undefined when no language is stored', () => {
      // Given no stored language
      
      // When detect is called
      const result = languageDetector.detect();
      
      // Then it should return undefined
      expect(result).toBe(undefined);
    });

    it('should handle errors and return undefined', () => {
      // Given a language store that throws an error
      const errorStore = {
        getLanguage: jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        }),
        setLanguage: jest.fn()
      };
      
      const errorDetector = createLanguageDetector(errorStore);
      
      // When detect is called
      const result = errorDetector.detect();
      
      // Then it should return undefined
      expect(result).toBe(undefined);
    });
  });

  describe('cacheUserLanguage', () => {
    it('should store the provided language', () => {
      // Given a language
      const language = 'es';
      
      // When cacheUserLanguage is called
      languageDetector.cacheUserLanguage?.(language);
      
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
      
      const errorDetector = createLanguageDetector(errorStore);
      
      // When cacheUserLanguage is called
      // Then no error should be thrown
      expect(() => {
        errorDetector.cacheUserLanguage?.('de');
      }).not.toThrow();
    });
  });

  describe('plugin structure', () => {
    it('should have the correct plugin structure', () => {
      expect(languageDetector).toEqual(expect.objectContaining({
        type: 'languageDetector',
        detect: expect.any(Function),
        cacheUserLanguage: expect.any(Function)
      }));
    });
  });
});
