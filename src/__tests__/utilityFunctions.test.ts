/// <reference types="jest" />
import {
  getCurrentLanguage,
  changeLanguage,
  getAvailableLanguages,
  addResourceBundle,
  initI18n,
} from '../i18n';
import { mockTranslationResources } from './setup';
import i18n from 'i18next';

// Mock i18next for this test file
jest.mock('i18next');
const mockedI18n = i18n as jest.Mocked<typeof i18n>;

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentLanguage', () => {
    it('should return current language from i18n instance', () => {
      mockedI18n.language = 'en';
      
      const result = getCurrentLanguage();
      
      expect(result).toBe('en');
    });

    it('should return updated language after change', () => {
      mockedI18n.language = 'fa';
      
      const result = getCurrentLanguage();
      
      expect(result).toBe('fa');
    });

    it('should return Kurdish language', () => {
      mockedI18n.language = 'ku';
      
      const result = getCurrentLanguage();
      
      expect(result).toBe('ku');
    });
  });

  describe('changeLanguage', () => {
    it('should call i18n.changeLanguage with correct language', async () => {
      mockedI18n.changeLanguage.mockResolvedValue(undefined as any);
      
      await changeLanguage('fa');
      
      expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('fa');
    });

    it('should handle language change to Kurdish', async () => {
      mockedI18n.changeLanguage.mockResolvedValue(undefined as any);
      
      await changeLanguage('ku');
      
      expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('ku');
    });

    it('should handle language change errors', async () => {
      const error = new Error('Language change failed');
      mockedI18n.changeLanguage.mockRejectedValue(error);
      
      await expect(changeLanguage('invalid')).rejects.toThrow('Language change failed');
    });

    it('should handle empty string language', async () => {
      mockedI18n.changeLanguage.mockResolvedValue(undefined as any);
      
      await changeLanguage('');
      
      expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('');
    });
  });

  describe('getAvailableLanguages', () => {
    it('should return available languages from resources', () => {
      mockedI18n.options = {
        resources: {
          en: { translation: {} },
          fa: { translation: {} },
          ku: { translation: {} },
        },
      };
      
      const result = getAvailableLanguages();
      
      expect(result).toEqual(['en', 'fa', 'ku']);
    });

    it('should return empty array when no resources', () => {
      mockedI18n.options = {};
      
      const result = getAvailableLanguages();
      
      expect(result).toEqual([]);
    });

    it('should return empty array when resources is null', () => {
      mockedI18n.options = {
        resources: null as any,
      };
      
      const result = getAvailableLanguages();
      
      expect(result).toEqual([]);
    });

    it('should handle single language', () => {
      mockedI18n.options = {
        resources: {
          en: { translation: {} },
        },
      };
      
      const result = getAvailableLanguages();
      
      expect(result).toEqual(['en']);
    });
  });

  describe('addResourceBundle', () => {
    it('should call i18n.addResourceBundle with correct parameters', () => {
      const resources = { hello: 'سلام' };
      
      addResourceBundle('fa', 'translation', resources);
      
      expect(mockedI18n.addResourceBundle).toHaveBeenCalledWith(
        'fa',
        'translation',
        resources,
        true,
        true
      );
    });

    it('should handle Kurdish language resources', () => {
      const resources = { hello: 'سڵاو' };
      
      addResourceBundle('ku', 'translation', resources);
      
      expect(mockedI18n.addResourceBundle).toHaveBeenCalledWith(
        'ku',
        'translation',
        resources,
        true,
        true
      );
    });

    it('should handle custom namespace', () => {
      const resources = { common: { save: 'Save' } };
      
      addResourceBundle('en', 'common', resources);
      
      expect(mockedI18n.addResourceBundle).toHaveBeenCalledWith(
        'en',
        'common',
        resources,
        true,
        true
      );
    });

    it('should handle empty resources object', () => {
      const resources = {};
      
      addResourceBundle('en', 'translation', resources);
      
      expect(mockedI18n.addResourceBundle).toHaveBeenCalledWith(
        'en',
        'translation',
        resources,
        true,
        true
      );
    });

    it('should handle nested resources', () => {
      const resources = {
        auth: {
          login: 'Login',
          logout: 'Logout',
        },
        common: {
          save: 'Save',
          cancel: 'Cancel',
        },
      };
      
      addResourceBundle('en', 'translation', resources);
      
      expect(mockedI18n.addResourceBundle).toHaveBeenCalledWith(
        'en',
        'translation',
        resources,
        true,
        true
      );
    });
  });

  describe('initI18n', () => {
    it('should be an alias for createI18n', () => {
      // Since initI18n is just an alias, we test that it exists and is a function
      expect(typeof initI18n).toBe('function');
    });

    it('should accept I18nConfig parameter', () => {
      const config = {
        resources: mockTranslationResources,
      };
      
      // Should not throw when called with valid config
      expect(() => initI18n(config)).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow', async () => {
      // Setup mock responses
      mockedI18n.language = 'en';
      mockedI18n.changeLanguage.mockResolvedValue(undefined as any);
      mockedI18n.options = {
        resources: mockTranslationResources,
      };
      
      // Test initial state
      expect(getCurrentLanguage()).toBe('en');
      expect(getAvailableLanguages()).toEqual(['en', 'fa', 'ku']);
      
      // Test language change
      await changeLanguage('fa');
      expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('fa');
      
      // Test adding resources
      const newResources = { newKey: 'New Value' };
      addResourceBundle('fa', 'translation', newResources);
      expect(mockedI18n.addResourceBundle).toHaveBeenCalledWith(
        'fa',
        'translation',
        newResources,
        true,
        true
      );
    });
  });
});