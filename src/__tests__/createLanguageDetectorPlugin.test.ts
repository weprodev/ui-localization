/// <reference types="jest" />
import { createI18n, DefaultLanguageStore } from '../i18n';
import type { LanguageStore, I18nConfig } from '../i18n';
import i18n from 'i18next';

// Mock i18next
jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockResolvedValue(undefined),
  changeLanguage: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  language: 'en',
  languages: ['en', 'es'],
  getResourceBundle: jest.fn(),
  addResourceBundle: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

describe('Language Detector Plugin (via createI18n)', () => {
  let mockLanguageStore: jest.Mocked<LanguageStore>;
  let mockOnLanguageChange: jest.Mock;
  const mockedI18n = i18n as jest.Mocked<typeof i18n>;
  
  const mockResources = {
    en: {
      translation: {
        hello: 'Hello',
        world: 'World',
      },
    },
    es: {
      translation: {
        hello: 'Hola',
        world: 'Mundo',
      },
    },
  };

  beforeEach(() => {
    mockLanguageStore = {
      getLanguage: jest.fn(),
      setLanguage: jest.fn(),
    };
    mockOnLanguageChange = jest.fn();
    jest.clearAllMocks();
  });

  describe('language detection integration', () => {
    it('should initialize i18n with language detector plugin', async () => {
      mockLanguageStore.getLanguage.mockReturnValue('es');
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
        onLanguageChange: mockOnLanguageChange,
      };
      
      await createI18n(config);
      
      expect(mockedI18n.use).toHaveBeenCalled();
      expect(mockedI18n.init).toHaveBeenCalled();
      
      // Check that the plugin was registered
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      expect(useCall).toBeDefined();
    });

    it('should use custom language store for language detection', async () => {
      mockLanguageStore.getLanguage.mockReturnValue('fr');
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      await createI18n(config);
      
      // Verify that the language store was used
      expect(mockLanguageStore.getLanguage).toHaveBeenCalled();
    });

    it('should handle language store returning null', async () => {
      mockLanguageStore.getLanguage.mockReturnValue(null as any);
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      await createI18n(config);
      
      expect(mockLanguageStore.getLanguage).toHaveBeenCalled();
      expect(mockedI18n.init).toHaveBeenCalled();
    });

    it('should handle language store errors gracefully', async () => {
      mockLanguageStore.getLanguage.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      // Should not throw, should handle error gracefully
      await expect(createI18n(config)).resolves.not.toThrow();
    });
  });

  describe('language caching integration', () => {
    it('should use language store for caching language changes', async () => {
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
        onLanguageChange: mockOnLanguageChange,
      };
      
      await createI18n(config);
      
      // Get the language detector plugin that was registered
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      expect(useCall).toBeDefined();
      const plugin = useCall![0] as any;
      
      // Test cacheUserLanguage method
      plugin.cacheUserLanguage('de');
      
      expect(mockLanguageStore.setLanguage).toHaveBeenCalledWith('de');
    });

    it('should handle language store setLanguage errors', async () => {
      mockLanguageStore.setLanguage.mockImplementation(() => {
        throw new Error('Storage write error');
      });
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      await createI18n(config);
      
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      const plugin = useCall![0] as any;
      
      // Should not throw, should handle error gracefully
      expect(() => plugin.cacheUserLanguage('de')).not.toThrow();
    });
  });

  describe('default language store integration', () => {
    it('should work with DefaultLanguageStore when no custom store provided', async () => {
      const config: I18nConfig = {
        resources: mockResources,
      };
      
      await createI18n(config);
      
      expect(mockedI18n.use).toHaveBeenCalled();
      expect(mockedI18n.init).toHaveBeenCalled();
    });

    it('should detect language from DefaultLanguageStore', async () => {
      const defaultStore = new DefaultLanguageStore();
      defaultStore.setLanguage('es');
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: defaultStore,
      };
      
      await createI18n(config);
      
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      const plugin = useCall![0] as any;
      
      // Test detect method with callback
      const mockCallback = jest.fn();
      plugin.detect(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith('es');
    });

    it('should cache language in DefaultLanguageStore', async () => {
      const defaultStore = new DefaultLanguageStore();
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: defaultStore,
      };
      
      await createI18n(config);
      
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      const plugin = useCall![0] as any;
      
      // Cache a new language
      plugin.cacheUserLanguage('fr');
      
      // Verify it was stored
      expect(defaultStore.getLanguage()).toBe('fr');
    });
  });

  describe('plugin interface compliance', () => {
    it('should create plugin with correct interface', async () => {
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      await createI18n(config);
      
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      expect(useCall).toBeDefined();
      const plugin = useCall![0] as any;
      
      // Check required properties
      expect(plugin.type).toBe('languageDetector');
      expect(plugin.async).toBe(false);
      
      // Check required methods
      expect(typeof plugin.init).toBe('function');
      expect(typeof plugin.detect).toBe('function');
      expect(typeof plugin.cacheUserLanguage).toBe('function');
    });

    it('should have working init method', async () => {
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      await createI18n(config);
      
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      const plugin = useCall![0] as any;
      
      // Should not throw
      expect(() => plugin.init()).not.toThrow();
    });
  });

  describe('fallback behavior', () => {
    it('should fallback to "en" when language store returns falsy value', async () => {
      mockLanguageStore.getLanguage.mockReturnValue('');
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      await createI18n(config);
      
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      const plugin = useCall![0] as any;
      
      const mockCallback = jest.fn();
      plugin.detect(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith('en');
    });

    it('should fallback to "en" when language store throws error', async () => {
      mockLanguageStore.getLanguage.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const config: I18nConfig = {
        resources: mockResources,
        languageStore: mockLanguageStore,
      };
      
      await createI18n(config);
      
      const useCall = mockedI18n.use.mock.calls.find(call => 
        call[0] && typeof call[0] === 'object' && call[0].type === 'languageDetector'
      );
      
      const plugin = useCall![0] as any;
      
      const mockCallback = jest.fn();
      plugin.detect(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith('en');
    });
  });
});