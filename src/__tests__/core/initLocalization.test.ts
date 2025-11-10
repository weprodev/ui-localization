import i18n from 'i18next';
import { initLocalization } from '../../core/initLocalization';
import { createLanguageDetector } from '../../core/languageDetector';
import { DefaultLanguageStore } from '../../core/DefaultLanguageStore';
import { MockLanguageStore } from '../__mocks__/mocks';
import { LocalizationConfig } from '../../core/types';

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
  createLanguageDetector: jest.fn().mockReturnValue('languageDetector-mock'),
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
    await initLocalization(defaultConfig);
    
    expect(i18n.use).toHaveBeenCalledWith('initReactI18next-mock');
    expect(i18n.use).toHaveBeenCalledWith('languageDetector-mock');
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      resources: mockResources,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: { escapeValue: false },
    }));
    expect(createLanguageDetector).toHaveBeenCalledWith(mockLanguageStore);
  });

  it('should use the language from store when available', async () => {
    mockLanguageStore.setLanguage('fr');
    
    await initLocalization(defaultConfig);
    
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      resources: mockResources,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: { escapeValue: false },
    }));
  });

  it('should use fallbackLng when no language is in store', async () => {
    const config = {
      ...defaultConfig,
      fallbackLng: 'es',
    };
    
    await initLocalization(config);
    
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      fallbackLng: 'es',
      resources: mockResources,
      compatibilityJSON: 'v4',
      interpolation: { escapeValue: false },
    }));
  });

  it('should handle language store errors gracefully', async () => {
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
    
    await initLocalization(config);
    
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      fallbackLng: 'de',
      resources: mockResources,
      compatibilityJSON: 'v4',
      interpolation: { escapeValue: false },
    }));
  });

  it('should use custom interpolation options when provided', async () => {
    const config = {
      ...defaultConfig,
      interpolation: { escapeValue: true },
    };
    
    await initLocalization(config);
    
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      interpolation: { escapeValue: true },
    }));
  });

  it('should use custom compatibility JSON when provided', async () => {
    const config = {
      ...defaultConfig,
      compatibilityJSON: 'v4' as const,
    };
    
    await initLocalization(config);
    
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      compatibilityJSON: 'v4',
    }));
  });

  it('should create a default language store when none is provided', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { languageStore: _languageStore, ...configWithoutStore } = defaultConfig;
    
    await initLocalization(configWithoutStore);
    
    expect(createLanguageDetector).toHaveBeenCalledWith(expect.any(DefaultLanguageStore));
  });


  it('should return a Promise', async () => {
    const result = initLocalization(defaultConfig);
    
    expect(result).toBeInstanceOf(Promise);
    await result;
  });

  it('should handle initialization failure', async () => {
    const initError = new Error('Initialization failed');
    (i18n.init as jest.Mock).mockRejectedValueOnce(initError);
    
    await expect(initLocalization(defaultConfig)).rejects.toThrow('Initialization failed');
  });

  it('should handle empty resources object', async () => {
    const configWithEmptyResources = {
      ...defaultConfig,
      resources: {}
    };
    
    await initLocalization(configWithEmptyResources);
    
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      resources: {},
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: { escapeValue: false },
    }));
  });

  it('should handle undefined fallbackLng', async () => {
    const configWithoutFallback = {
      ...defaultConfig,
      fallbackLng: undefined
    };
    
    await initLocalization(configWithoutFallback);
    
    expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
      fallbackLng: 'en',
    }));
  });
});
