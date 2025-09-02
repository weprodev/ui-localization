# @weprodev/localization

A comprehensive localization package for React Native applications using i18next and react-i18next.

## Features

- Generic language store interface for flexible storage implementations
- Default in-memory language store
- Custom language detector plugin
- TypeScript support with strict typing
- React Native compatible
- Configurable fallback language
- Language change event handling

## Installation

```bash
npm install @weprodev/localization
# or
yarn add @weprodev/localization
```

## Usage

### Basic Setup

```typescript
import { createI18n, I18nConfig } from '@weprodev/localization';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      goodbye: 'Goodbye'
    }
  },
  fa: {
    translation: {
      welcome: 'خوش آمدید',
      goodbye: 'خداحافظ'
    }
  },
  ku: {
    translation: {
      welcome: 'بەخێربێن',
      goodbye: 'خوا حافیز'
    }
  }
};

const config: I18nConfig = {
  resources,
  fallbackLng: 'en',
  onLanguageChange: (language) => {
    console.log('Language changed to:', language);
  }
};

createI18n(config).then(() => {
  console.log('i18n initialized');
});
```

### Custom Language Store

```typescript
import { LanguageStore, createI18n } from '@weprodev/localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageLanguageStore implements LanguageStore {
  private static readonly LANGUAGE_KEY = 'user_language';
  private currentLanguage: string = 'en';

  async getLanguage(): Promise<string> {
    try {
      const language = await AsyncStorage.getItem(AsyncStorageLanguageStore.LANGUAGE_KEY);
      return language || 'en';
    } catch {
      return 'en';
    }
  }

  async setLanguage(language: string): Promise<void> {
    this.currentLanguage = language;
    try {
      await AsyncStorage.setItem(AsyncStorageLanguageStore.LANGUAGE_KEY, language);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }
}

const customStore = new AsyncStorageLanguageStore();
const config: I18nConfig = {
  resources,
  languageStore: customStore,
  fallbackLng: 'en'
};
```

### Utility Functions

```typescript
import { 
  getCurrentLanguage, 
  changeLanguage, 
  getAvailableLanguages 
} from '@weprodev/localization';

// Get current language
const currentLang = getCurrentLanguage();

// Change language
await changeLanguage('fa');

// Get available languages
const availableLanguages = getAvailableLanguages();
```

## API Reference

### Interfaces

#### `LanguageStore`
Generic interface for language storage implementations.

```typescript
interface LanguageStore {
  getLanguage(): string;
  setLanguage(language: string): void;
}
```

#### `I18nConfig`
Configuration interface for i18n initialization.

```typescript
interface I18nConfig {
  resources: Resource;
  fallbackLng?: string;
  compatibilityJSON?: 'v4';
  interpolation?: {
    escapeValue?: boolean;
  };
  languageStore?: LanguageStore;
  onLanguageChange?: (language: string) => void;
}
```

### Classes

#### `DefaultLanguageStore`
Default in-memory implementation of `LanguageStore`.

### Functions

#### `createI18n(config: I18nConfig): Promise<i18n>`
Initializes and configures the i18n instance.

#### `getCurrentLanguage(): string`
Returns the current active language.

#### `changeLanguage(language: string): Promise<void>`
Changes the current language.

#### `getAvailableLanguages(): string[]`
Returns an array of available language codes.

## Supported Languages

This package is designed to work with:
- English (en)
- Farsi/Persian (fa) - RTL support
- Kurdish Sorani (ku) - RTL support

## License

MIT