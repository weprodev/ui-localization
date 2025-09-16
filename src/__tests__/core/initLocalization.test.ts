import i18n from 'i18next';
import { initLocalization } from '../../core/initLocalization';
import { createLanguageDetectorPlugin } from '../../core/languageDetector';
import { DefaultLanguageStore } from '../../core/DefaultLanguageStore';
import { MockLanguageStore } from '../__mocks__/mocks';
import { LocalizationConfig } from '../../core/types';

// Mock i18next and react-i18next
jest.mock('i18next', () => {
  const mockI18n = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue({}),
    on: jest.fn(),
  };
  return mockI18n;
});

jest.mock('react-i18next', () => ({
  initReactI18next: 'initReactI18next-mock',
}));

jest.mock('../../core/languageDetector', () => ({
  createLanguageDetectorPlugin: jest.fn().mockReturnValue('languageDetector-mock'),
}));

describe('initLocalization', () => {
  const mockResources = {
    en: {
      translation: {
        hello: 'Hello',
        welcome: 'Welcome',
      },
    },
    fr: {
      translation: {
        hello: 'Bonjour',
        welcome: 'Bienvenue',
      },
    },
  };

  let defaultConfig: LocalizationConfig;
  let mockLanguageStore: MockLanguageStore;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockLanguageStore = new MockLanguageStore();
    
    defaultConfig = {
      resources: mockResources,
      languageStore: mockLanguageStore,
    };
  });

  it('should initialize i18n with default options when minimal config is provided', async () => {
    // When initLocalization is called with minimal config
    await initLocalization(defaultConfig);
    
    // Then i18n should be initialized with expected plugins and options
    expect(i18n.use).toHaveBeenCalledWith('initReactI18next-mock');
    expect(i18n.use).toHaveBeenCalledWith('languageDetector-mock');
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      resources: mockResources,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: { escapeValue: false },
    }));
    expect(createLanguageDetectorPlugin).toHaveBeenCalledWith(mockLanguageStore);
  });

  it('should use the language from store when available', async () => {
    // Given a language store with a language set
    mockLanguageStore.setLanguage('fr');
    
    // When initLocalization is called
    await initLocalization(defaultConfig);
    
    // Then i18n should be initialized with that language
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      lng: 'fr',
    }));
  });

  it('should use fallbackLng when no language is in store', async () => {
    // Given a config with a specific fallback language
    const config = {
      ...defaultConfig,
      fallbackLng: 'es',
    };
    
    // When initLocalization is called
    await initLocalization(config);
    
    // Then i18n should be initialized with the fallback language
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      fallbackLng: 'es',
      lng: 'es',
    }));
  });

  it('should handle language store errors gracefully', async () => {
    // Given a language store that throws an error
    const errorStore = {
      getLanguage: jest.fn().mockImplementation(() => {
        throw new Error('Storage error');
      }),
      setLanguage: jest.fn(),
    };
    
    const config = {
      ...defaultConfig,
      languageStore: errorStore,
      fallbackLng: 'de',
    };
    
    // When initLocalization is called
    await initLocalization(config);
    
    // Then i18n should be initialized with the fallback language
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      lng: 'de',
    }));
  });

  it('should use custom interpolation options when provided', async () => {
    // Given a config with custom interpolation
    const config = {
      ...defaultConfig,
      interpolation: { escapeValue: true },
    };
    
    // When initLocalization is called
    await initLocalization(config);
    
    // Then i18n should be initialized with the custom interpolation
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      interpolation: { escapeValue: true },
    }));
  });

  it('should use custom compatibility JSON when provided', async () => {
    // Given a config with custom compatibilityJSON
    const config = {
      ...defaultConfig,
      compatibilityJSON: 'v4' as const,
    };
    
    // When initLocalization is called
    await initLocalization(config);
    
    // Then i18n should be initialized with the custom compatibilityJSON
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      compatibilityJSON: 'v4',
    }));
  });

  it('should create a default language store when none is provided', async () => {
    // Given a config without a language store
    const { languageStore, ...configWithoutStore } = defaultConfig;
    
    // When initLocalization is called
    await initLocalization(configWithoutStore);
    
    // Then a default language store should be created and used
    expect(createLanguageDetectorPlugin).toHaveBeenCalledWith(expect.any(DefaultLanguageStore));
  });

  it('should register language change listener when onLanguageChange is provided', async () => {
    // Given a mock for the language change callback
    const onLanguageChange = jest.fn();
    const config = {
      ...defaultConfig,
      onLanguageChange,
    };
    
    // When initLocalization is called
    await initLocalization(config);
    
    // Then the language change listener should be registered
    expect(i18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
    
    // And when the language change event is triggered
    const languageChangedHandler = (i18n.on as jest.Mock).mock.calls[0][1];
    languageChangedHandler('es');
    
    // Then the callback should be called with the new language
    expect(onLanguageChange).toHaveBeenCalledWith('es');
  });

  it('should not register language change listener when onLanguageChange is not provided', async () => {
    // When initLocalization is called without onLanguageChange
    await initLocalization(defaultConfig);
    
    // Then no language change listener should be registered
    expect(i18n.on).not.toHaveBeenCalled();
  });

  it('should return the i18n instance', async () => {
    // When initLocalization is called
    const result = await initLocalization(defaultConfig);
    
    // Then it should return the i18n instance (which is the mock i18n object in this case)
    expect(result).toBe(i18n);
  });
});
