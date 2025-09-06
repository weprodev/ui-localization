import { DefaultLanguageStore } from '../../core/DefaultLanguageStore';
import { LanguageStore } from '../../core/types';

describe('DefaultLanguageStore', () => {
  let languageStore: LanguageStore;

  beforeEach(() => {
    // Create a fresh instance of DefaultLanguageStore before each test
    languageStore = new DefaultLanguageStore();
  });

  it('should return null when no language is set', () => {
    // When no language has been set, getLanguage should return null
    expect(languageStore.getLanguage()).toBeNull();
  });

  it('should store and retrieve the language correctly', () => {
    // Given a language code
    const language = 'en';
    
    // When setting the language
    languageStore.setLanguage(language);
    
    // Then getLanguage should return the stored language
    expect(languageStore.getLanguage()).toBe(language);
  });

  it('should update the language when a new one is set', () => {
    // Given an initial language
    languageStore.setLanguage('en');
    
    // When setting a new language
    const newLanguage = 'fr';
    languageStore.setLanguage(newLanguage);
    
    // Then getLanguage should return the new language
    expect(languageStore.getLanguage()).toBe(newLanguage);
  });

  it('should handle multiple language changes', () => {
    // Test sequence of language changes
    const languages = ['en', 'fr', 'es', 'de', 'it'];
    
    for (const lang of languages) {
      languageStore.setLanguage(lang);
      expect(languageStore.getLanguage()).toBe(lang);
    }
  });

  it('should treat empty string as falsy and return null', () => {
    // The implementation treats empty string as falsy and returns null
    languageStore.setLanguage('');
    expect(languageStore.getLanguage()).toBeNull();
  });
});
