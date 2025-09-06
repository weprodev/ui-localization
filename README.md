# WPD Package Localization

A powerful and flexible localization package for React and React Native applications.

## Features

- Type-safe translations with TypeScript
- Support for nested translation structures
- React hooks for easy integration
- Support for string interpolation
- Language detection and switching
- Custom language storage

## Installation

```bash
npm install @weprodev/wpd-pkg-localization i18next react-i18next
# or
yarn add @weprodev/wpd-pkg-localization i18next react-i18next
```

### GitHub Packages Installation

To install from GitHub Packages, add the following to your `.npmrc` file:

```
@weprodev:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${YOUR_GITHUB_TOKEN}
```

Then install the package:

```bash
npm install @weprodev/wpd-pkg-localization
```

## Usage

### Basic Setup

```typescript
import { initLocalization, useTranslation } from '@weprodev/wpd-pkg-localization';

// Define your translation structure
type Translations = {
  hello: string;
  welcome: string;
  nested: {
    greeting: string;
    farewell: string;
  };
};

// Define your translations
const resources = {
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
  fr: {
    translation: {
      hello: 'Bonjour',
      welcome: 'Bienvenue {{name}}',
      nested: {
        greeting: 'Bonjour',
        farewell: 'Au revoir',
      },
    },
  },
};

// Initialize localization
initLocalization({
  resources,
  fallbackLng: 'en',
});

// In your component
function MyComponent() {
  // Create the translation structure
  const translationStructure = {
    hello: '',
    welcome: '',
    nested: {
      greeting: '',
      farewell: '',
    },
  };

  // Use the hook with your translation structure
  const t = useTranslation<Translations>(translationStructure);

  return (
    <div>
      <h1>{t.hello}</h1>
      <p>{t.nested.greeting}</p>
    </div>
  );
}
```

### Using Interpolation

```typescript
import { useTranslationWithInterpolation } from '@weprodev/wpd-pkg-localization';

function MyComponent() {
  const welcomeMessage = useTranslationWithInterpolation('welcome', { name: 'John' });
  
  return <div>{welcomeMessage}</div>;
}
```

### Using Custom Language Store

#### Web Example

```typescript
import { initLocalization, LanguageStore } from '@weprodev/wpd-pkg-localization';

// Create a custom language store for web using localStorage
class WebLanguageStore implements LanguageStore {
  getLanguage(): string | null {
    return localStorage.getItem('app-language');
  }

  setLanguage(language: string): void {
    localStorage.setItem('app-language', language);
  }
}

// Initialize with custom store
initLocalization({
  resources: { /* your translations */ },
  languageStore: new WebLanguageStore(),
});
```

#### React Native Example with AsyncStorage

```typescript
import { initLocalization, LanguageStore } from '@weprodev/wpd-pkg-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a custom language store for React Native using AsyncStorage
class RNLanguageStore implements LanguageStore {
  getLanguage(): string | null {
    // Note: Since LanguageStore interface doesn't support async methods,
    // we need to use a synchronous approach or pre-load the value
    // This is just an example - in a real app, you might want to
    // load the language during app initialization
    let storedLanguage = null;
    try {
      // In a real app, you would need to handle this asynchronously
      // during app initialization, not inline like this
      storedLanguage = AsyncStorage.getItem('app-language');
    } catch (error) {
      console.error('Failed to get language from storage', error);
    }
    return storedLanguage;
  }

  setLanguage(language: string): void {
    try {
      // Fire and forget approach
      AsyncStorage.setItem('app-language', language);
    } catch (error) {
      console.error('Failed to store language', error);
    }
  }
}

// Initialize with custom store
initLocalization({
  resources: { /* your translations */ },
  languageStore: new RNLanguageStore(),
});
```

#### React Native Example with MMKV

```typescript
import { initLocalization, LanguageStore } from '@weprodev/wpd-pkg-localization';
import { MMKV } from 'react-native-mmkv';

// Create storage instance
const storage = new MMKV();

// Create a custom language store for React Native using MMKV
class MMKVLanguageStore implements LanguageStore {
  getLanguage(): string | null {
    return storage.getString('app-language') || null;
  }

  setLanguage(language: string): void {
    storage.set('app-language', language);
  }
}

// Initialize with custom store
initLocalization({
  resources: { /* your translations */ },
  languageStore: new MMKVLanguageStore(),
});
```

### Changing Language

```typescript
import { changeLanguage, getCurrentLanguage } from '@weprodev/wpd-pkg-localization';

// Get current language
const currentLang = getCurrentLanguage();

// Change language
const switchLanguage = async () => {
  await changeLanguage('fr');
};
```

## API Reference

### Hooks

- `useTranslation<T>(translationStructure)` - Creates a type-safe translation object
- `useTranslationWithInterpolation(key, variables, components)` - For translations with variable interpolation and React components
- `useTranslationInjection(key, variables)` - Direct access to i18next's t function

### Configuration

- `initLocalization(config)` - Initialize the i18n instance with configuration

### Utilities

- `changeLanguage(language)` - Change the current language
- `getCurrentLanguage()` - Get the current language
- `getAvailableLanguages()` - Get all available languages

### Types

- `Translation<T>` - Type for creating strongly-typed translations
- `TranslationKeys<T>` - Helper type for translation keys
- `LanguageStore` - Interface for custom language storage implementations
- `LocalizationConfig` - Configuration options for initialization

## License

MIT
