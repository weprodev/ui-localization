import { DefaultLanguageStore } from '../../core/DefaultLanguageStore';
import { LanguageStore } from '../../core/types';

describe('DefaultLanguageStore', () => {
  let languageStore: LanguageStore;

  beforeEach(() => {
    languageStore = new DefaultLanguageStore();
  });

  it('should return null when no language is set', () => {
    expect(languageStore.getLanguage()).toBeNull();
  });

  it('should store and retrieve the language correctly', () => {
    const language = 'en';
    
    languageStore.setLanguage(language);
    
    expect(languageStore.getLanguage()).toBe(language);
  });

  it('should update the language when a new one is set', () => {
    languageStore.setLanguage('en');
    
    const newLanguage = 'fr';
    languageStore.setLanguage(newLanguage);
    
    expect(languageStore.getLanguage()).toBe(newLanguage);
  });

  it('should handle multiple language changes', () => {
    const languages = ['en', 'fr', 'es', 'de', 'it'];
    
    for (const lang of languages) {
      languageStore.setLanguage(lang);
      expect(languageStore.getLanguage()).toBe(lang);
    }
  });

  it('should treat empty string as falsy and return null', () => {
    languageStore.setLanguage('');
    expect(languageStore.getLanguage()).toBeNull();
  });
});
