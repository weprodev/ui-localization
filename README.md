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
import { initI18n, useTranslate } from '@weprodev/wpd-pkg-localization';

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

// Initialize i18n
initI18n({
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
  const t = useTranslate<Translations>(translationStructure);

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
import { useTranslateWithInterpolation } from '@weprodev/wpd-pkg-localization';

function MyComponent() {
  const welcomeMessage = useTranslateWithInterpolation('welcome', { name: 'John' });
  
  return <div>{welcomeMessage}</div>;
}
```

### Using Custom Language Store

```typescript
import { initI18n, LanguageStore } from '@weprodev/wpd-pkg-localization';

// Create a custom language store for persistent storage
class MyCustomLanguageStore implements LanguageStore {
  getLanguage(): string | null {
    return localStorage.getItem('app-language');
  }

  setLanguage(language: string): void {
    localStorage.setItem('app-language', language);
  }
}

// Initialize with custom store
initI18n({
  resources: { /* your translations */ },
  languageStore: new MyCustomLanguageStore(),
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

- `useTranslate<T>(translationStructure)` - Creates a type-safe translation object
- `useTranslateWithInterpolation(key, variables, components)` - For translations with variable interpolation
- `useTranslationInjection(key, variables)` - Direct access to i18next's t function

### Configuration

- `initI18n(config)` - Initialize the i18n instance
- `createI18n(config)` - Create a custom i18n instance

### Utilities

- `changeLanguage(language)` - Change the current language
- `getCurrentLanguage()` - Get the current language
- `getAvailableLanguages()` - Get all available languages
- `addResourceBundle(language, namespace, resources)` - Add new translations

## License

MIT
