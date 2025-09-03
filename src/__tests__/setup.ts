/// <reference types="jest" />
import * as React from 'react';

// Suppress deprecation warnings from @testing-library/react-hooks
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('react-test-renderer') ||
     message.includes('@testing-library/react-hooks') ||
     message.includes('deprecated'))
  ) {
    return; // Suppress these warnings
  }
  originalConsoleError(...args);
};

// Mock react-native modules
jest.mock('react-native-mmkv', () => {
  class MockMMKV {
    private storage: Map<string, any>;

    constructor() {
      this.storage = new Map();
    }

    set(key: string, value: any) {
      this.storage.set(key, value);
    }

    getString(key: string): string | undefined {
      if (!this.storage.has(key)) {
        return undefined;
      }
      return this.storage.get(key);
    }

    contains(key: string): boolean {
      return this.storage.has(key);
    }

    delete(key: string) {
      this.storage.delete(key);
    }

    clearAll() {
      this.storage.clear();
    }

    getAllKeys() {
      return Array.from(this.storage.keys());
    }
  }

  return {
    MMKV: MockMMKV,
  };
});

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: (obj: any) => obj.ios || obj.default,
  },
  NativeModules: {},
  NativeEventEmitter: class MockNativeEventEmitter {
    addListener() {
      return { remove: () => {} };
    }
    removeAllListeners() {}
  },
  Dimensions: {
    get: () => ({ width: 375, height: 667 }),
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  Alert: {
    alert: () => {},
  },
}));

// Create a chainable mock for i18next
const createChainableMock = () => {
  const mock = {
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

  // Make all chainable methods return the mock itself
  mock.use.mockReturnValue(mock);
  mock.init.mockResolvedValue(mock);

  return mock;
};

const mockI18next = createChainableMock();

jest.mock('i18next', () => mockI18next);

// Mock react-i18next
jest.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  useTranslation: () => ({
    t: jest.fn((key: string) => key),
    i18n: {
      changeLanguage: jest.fn().mockResolvedValue(undefined),
      language: 'en',
    },
  }),
  Trans: ({
    i18nKey,
    children,
  }: {
    i18nKey: string;
    children?: React.ReactNode;
  }) => children || i18nKey,
}));

// Mock React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: (fn: () => any, _deps: any[]) => fn(),
}));

// Test utilities
export const mockTranslationResources = {
  en: {
    translation: {
      hello: 'Hello',
      welcome: 'Welcome {{name}}',
      nested: {
        greeting: 'Good morning',
        farewell: 'Goodbye',
      },
    },
  },
  fa: {
    translation: {
      hello: 'سلام',
      welcome: 'خوش آمدید {{name}}',
      nested: {
        greeting: 'صبح بخیر',
        farewell: 'خداحافظ',
      },
    },
  },
  ku: {
    translation: {
      hello: 'سڵاو',
      welcome: 'بەخێربێیت {{name}}',
      nested: {
        greeting: 'بەیانیت باش',
        farewell: 'ماڵئاوا',
      },
    },
  },
};

export const mockLanguageStructure = {
  hello: '',
  welcome: '',
  nested: {
    greeting: '',
    farewell: '',
  },
};
