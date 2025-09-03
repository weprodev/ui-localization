/// <reference types="jest" />
import { DefaultLanguageStore, LanguageStore } from '../i18n';

describe('DefaultLanguageStore', () => {
  let languageStore: DefaultLanguageStore;

  beforeEach(() => {
    languageStore = new DefaultLanguageStore();
  });

  describe('constructor', () => {
    it('should initialize with null when no language is stored', () => {
      expect(languageStore.getLanguage()).toBe(null);
    });
  });

  describe('getLanguage', () => {
    it('should return null when no language is stored', () => {
      expect(languageStore.getLanguage()).toBe(null);
    });

    it('should return the updated language after setting', () => {
      languageStore.setLanguage('fa');
      expect(languageStore.getLanguage()).toBe('fa');
    });
  });

  describe('setLanguage', () => {
    it('should set the language to a new value', () => {
      languageStore.setLanguage('fa');
      expect(languageStore.getLanguage()).toBe('fa');
    });

    it('should set the language to Kurdish', () => {
      languageStore.setLanguage('ku');
      expect(languageStore.getLanguage()).toBe('ku');
    });

    it('should handle multiple language changes', () => {
      languageStore.setLanguage('fa');
      expect(languageStore.getLanguage()).toBe('fa');
      
      languageStore.setLanguage('ku');
      expect(languageStore.getLanguage()).toBe('ku');
      
      languageStore.setLanguage('en');
      expect(languageStore.getLanguage()).toBe('en');
    });

    it('should handle empty string as language', () => {
      languageStore.setLanguage('');
      expect(languageStore.getLanguage()).toBe(null); // Empty string is falsy, so || null returns null
    });

    it('should handle special characters in language code', () => {
      languageStore.setLanguage('en-US');
      expect(languageStore.getLanguage()).toBe('en-US');
    });
  });

  describe('LanguageStore interface compliance', () => {
    it('should implement LanguageStore interface', () => {
      const store: LanguageStore = new DefaultLanguageStore();
      expect(typeof store.getLanguage).toBe('function');
      expect(typeof store.setLanguage).toBe('function');
    });

    it('should work correctly when used as LanguageStore interface', () => {
      const store: LanguageStore = new DefaultLanguageStore();
      
      expect(store.getLanguage()).toBe(null);
      
      store.setLanguage('fa');
      expect(store.getLanguage()).toBe('fa');
    });
  });

  describe('edge cases', () => {
    it('should handle null as language (converted to string)', () => {
      languageStore.setLanguage(null as any);
      expect(languageStore.getLanguage()).toBe(null); // null is falsy, so || null returns null
    });

    it('should handle undefined as language (converted to string)', () => {
      languageStore.setLanguage(undefined as any);
      expect(languageStore.getLanguage()).toBe(null); // undefined is falsy, so || null returns null
    });

    it('should handle numeric values as language', () => {
      languageStore.setLanguage('123' as any);
      expect(languageStore.getLanguage()).toBe('123');
    });
  });
});