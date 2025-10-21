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
      mockLanguageStore.setLanguage('fr');
      
      const result = languageDetector.detect();
      
      expect(result).toBe('fr');
    });

    it('should return undefined when no language is stored', () => {
      const result = languageDetector.detect();
      
      expect(result).toBe(undefined);
    });

    it('should handle errors and return undefined', () => {
      const errorStore = {
        getLanguage: jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        }),
        setLanguage: jest.fn()
      };
      
      const errorDetector = createLanguageDetector(errorStore);
      
      const result = errorDetector.detect();
      
      expect(result).toBe(undefined);
    });
  });

  describe('cacheUserLanguage', () => {
    it('should store the provided language', () => {
      const language = 'es';
      
      languageDetector.cacheUserLanguage?.(language);
      
      expect(mockLanguageStore.getLanguage()).toBe(language);
    });

    it('should silently handle errors', () => {
      const errorStore = {
        getLanguage: jest.fn(),
        setLanguage: jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        })
      };
      
      const errorDetector = createLanguageDetector(errorStore);
      
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
