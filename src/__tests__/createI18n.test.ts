/// <reference types="jest" />
import { createI18n, DefaultLanguageStore, I18nConfig, LanguageStore } from '../i18n';
import { mockTranslationResources } from './setup';
import i18n from 'i18next';

// Mock i18next for this test file with proper chaining
jest.mock('i18next', () => {
  const mockI18nextChain = {
    use: jest.fn(),
    init: jest.fn(),
    changeLanguage: jest.fn().mockResolvedValue(undefined),
    addResourceBundle: jest.fn(),
    language: 'en',
    options: {
      resources: {
        en: { translation: {} },
        fa: { translation: {} },
        ku: { translation: {} },
      },
    },
    on: jest.fn(),
    off: jest.fn(),
    t: jest.fn((key: string) => key),
  };

  // Ensure proper chaining
  mockI18nextChain.use.mockReturnValue(mockI18nextChain);
  mockI18nextChain.init.mockResolvedValue(mockI18nextChain);

  return {
    __esModule: true,
    default: mockI18nextChain,
  };
});

const mockedI18n = i18n as any;

describe('createI18n', () => {
  let mockLanguageStore: LanguageStore;
  let mockOnLanguageChange: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLanguageStore = new DefaultLanguageStore();
    mockOnLanguageChange = jest.fn();
    
    // Reset i18n mock
    mockedI18n.use.mockReturnThis();
    mockedI18n.init.mockResolvedValue(mockedI18n as any);
    mockedI18n.on = jest.fn();
  });

  describe('basic configuration', () => {
    it('should create i18n instance with minimal config', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
      };

      await createI18n(config);

      expect(mockedI18n.use).toHaveBeenCalledTimes(2); // initReactI18next + languageDetector
      expect(mockedI18n.init).toHaveBeenCalledWith({
        resources: mockTranslationResources,
        compatibilityJSON: 'v4',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        lng: 'en',
      });
    });

    it('should create i18n instance with custom fallback language', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
        fallbackLng: 'fa',
      };

      await createI18n(config);

      expect(mockedI18n.init).toHaveBeenCalledWith({
        resources: mockTranslationResources,
        compatibilityJSON: 'v4',
        fallbackLng: 'fa',
        interpolation: { escapeValue: false },
        lng: 'fa',
      });
    });

    it('should create i18n instance with custom interpolation settings', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
        interpolation: { escapeValue: true },
      };

      await createI18n(config);

      expect(mockedI18n.init).toHaveBeenCalledWith({
        resources: mockTranslationResources,
        compatibilityJSON: 'v4',
        fallbackLng: 'en',
        interpolation: { escapeValue: true },
        lng: 'en',
      });
    });
  });

  describe('language store integration', () => {
    it('should use default language store when none provided', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
      };

      await createI18n(config);

      expect(mockedI18n.init).toHaveBeenCalledWith(
        expect.objectContaining({
          lng: 'en', // Default language from DefaultLanguageStore
        })
      );
    });

    it('should use custom language store', async () => {
      mockLanguageStore.setLanguage('fa');
      
      const config: I18nConfig = {
        resources: mockTranslationResources,
        languageStore: mockLanguageStore,
      };

      await createI18n(config);

      expect(mockedI18n.init).toHaveBeenCalledWith(
        expect.objectContaining({
          lng: 'fa',
        })
      );
    });

    it('should handle language store errors gracefully', async () => {
      const errorLanguageStore: LanguageStore = {
        getLanguage: jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        }),
        setLanguage: jest.fn(),
      };

      const config: I18nConfig = {
        resources: mockTranslationResources,
        languageStore: errorLanguageStore,
      };

      // Should not throw and should fallback to 'en'
      await expect(createI18n(config)).resolves.toBeDefined();
    });
  });

  describe('language change callback', () => {
    it('should set up language change listener when callback provided', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
        onLanguageChange: mockOnLanguageChange,
      };

      await createI18n(config);

      expect(mockedI18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
    });

    it('should not set up language change listener when no callback provided', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
      };

      await createI18n(config);

      expect(mockedI18n.on).not.toHaveBeenCalled();
    });

    it('should call language change callback when language changes', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
        onLanguageChange: mockOnLanguageChange,
      };

      await createI18n(config);

      // Simulate language change event
      const languageChangeCallback = (mockedI18n.on as jest.Mock).mock.calls[0][1];
      languageChangeCallback('fa');

      expect(mockOnLanguageChange).toHaveBeenCalledWith('fa');
    });
  });

  describe('compatibility settings', () => {
    it('should use v4 compatibility by default', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
      };

      await createI18n(config);

      expect(mockedI18n.init).toHaveBeenCalledWith(
        expect.objectContaining({
          compatibilityJSON: 'v4',
        })
      );
    });

    it('should use custom compatibility setting', async () => {
      const config: I18nConfig = {
        resources: mockTranslationResources,
        compatibilityJSON: 'v4',
      };

      await createI18n(config);

      expect(mockedI18n.init).toHaveBeenCalledWith(
        expect.objectContaining({
          compatibilityJSON: 'v4',
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle i18n initialization errors', async () => {
      mockedI18n.init.mockRejectedValue(new Error('Init failed'));
      
      const config: I18nConfig = {
        resources: mockTranslationResources,
      };

      await expect(createI18n(config)).rejects.toThrow('Init failed');
    });
  });

  describe('complete configuration', () => {
    it('should handle all configuration options', async () => {
      mockLanguageStore.setLanguage('ku');
      
      const config: I18nConfig = {
        resources: mockTranslationResources,
        fallbackLng: 'fa',
        compatibilityJSON: 'v4',
        interpolation: { escapeValue: true },
        languageStore: mockLanguageStore,
        onLanguageChange: mockOnLanguageChange,
      };

      await createI18n(config);

      expect(mockedI18n.use).toHaveBeenCalledTimes(2);
      expect(mockedI18n.init).toHaveBeenCalledWith({
        resources: mockTranslationResources,
        compatibilityJSON: 'v4',
        fallbackLng: 'fa',
        interpolation: { escapeValue: true },
        lng: 'ku',
      });
      expect(mockedI18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
    });
  });
});