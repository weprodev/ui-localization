# @weprodev/ui-localization

A lightweight, professional localization package for React and React Native applications built on top of i18next and react-i18next. This package provides a clean, type-safe API for managing translations with built-in language switching, variable injection, and component interpolation capabilities.

## ✨ Features

- 🌐 **Simple React Hooks** - Clean, intuitive hooks for translations and language management
- 🔄 **Language Switching** - Built-in language switching with persistence
- 📝 **Type-Safe Variable Injection** - Dynamic content insertion with compile-time parameter validation
- 🧩 **Unified Component Interpolation** - Embed React components within translations using the same `t` function
- 🔍 **Translation Validation** - CLI tools to ensure translation consistency
- 🔄 **Translation Sync** - Automated synchronization of translation files
- 📱 **React Native Support** - Full compatibility with React Native applications
- 🛡️ **Full Type Safety** - TypeScript support with type-safe keys, parameters, and component interpolation
- ⚡ **Performance Optimized** - Lightweight wrapper with minimal overhead

## 📦 Installation

```bash
npm install @weprodev/ui-localization
```

## 🚀 Quick Start

### React Applications

#### 1. Create Translation Files

Create a `translations` directory in your project with language files. **Important:** Use `as const` to enable type-safe parameter validation:

```typescript
// translations/en.ts
const en = {
  common: {
    hello: "Hello {{name}}!",
    welcome: "Welcome {{name}}!",
    goodbye: "Goodbye {{name}}!",
    greeting: "Hello, {{name}}!"
  },
  auth: {
    login: "Login",
    signup: "Sign Up",
    forgotPassword: "Forgot Password",
    welcomeMessage: "Welcome <strong>{{name}}</strong>! Please sign in to continue."
  },
  dashboard: {
    title: "Dashboard",
    heading: "<highlight>Dashboard</highlight> <bold>Overview</bold>",
    itemCount: "<count>{{count}}</count> of {{total}} items",
    summary: "Summary",
    recentActivity: "Recent Activity"
  }
} as const;

export default en;
```

```typescript
// translations/es.ts
const es = {
  common: {
    hello: "Hola {{name}}!",
    welcome: "Bienvenido {{name}}!",
    goodbye: "Adiós {{name}}!",
    greeting: "¡Hola, {{name}}!"
  },
  auth: {
    login: "Iniciar sesión",
    signup: "Registrarse",
    forgotPassword: "Contraseña olvidada",
    welcomeMessage: "Bienvenido <strong>{{name}}</strong>! Por favor inicia sesión para continuar."
  },
  dashboard: {
    title: "Panel de control",
    heading: "<highlight>Panel</highlight> <bold>General</bold>",
    itemCount: "<count>{{count}}</count> de {{total}} elementos",
    summary: "Resumen",
    recentActivity: "Actividad reciente"
  }
} as const;

export default es;
```

#### 2. Create Localization Configuration

```typescript
// src/localizationConfig.ts
import { LocalizationConfig, LanguageStore } from '@weprodev/ui-localization';
import en from '../translations/en';
import es from '../translations/es';

// Optional: Create a custom language store for persistence
class CustomLanguageStore implements LanguageStore {
  getLanguage(): string | null {
    return localStorage.getItem("app-language") || null;
  }

  setLanguage(language: string): void {
    localStorage.setItem("app-language", language);
  }
}

export const localizationConfig: LocalizationConfig = {
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  fallbackLng: 'en',
  languageStore: new CustomLanguageStore()
};
```

#### 3. Initialize Localization

```typescript
// src/index.tsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { initLocalization } from '@weprodev/ui-localization';
import { localizationConfig } from './localizationConfig';
import App from './App';

const rootElement = document.getElementById('root');

// Initialize localization before rendering the app
initLocalization(localizationConfig).then(() => {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
```

#### 4. Use Translations in Components

```typescript
// src/components/Welcome.tsx
import React from 'react';
import { useTranslation } from '@weprodev/ui-localization';
import en from '../translations/en';

const Welcome: React.FC<{ name: string }> = ({ name }) => {
  // Type-safe translation hook with path-based keys
  const { t } = useTranslation<typeof en>();
  
  return (
    <div>
      {/* TypeScript requires 'name' parameter because translation has {{name}} placeholder */}
      <h1>{t('common.welcome', { name })}</h1>
      <p>{t('common.hello', { name })}</p>
      {/* TypeScript will error if you use invalid keys like t('common.invalid') */}
      {/* TypeScript will error if you forget required parameters */}
    </div>
  );
};

export default Welcome;
```

**Alternative: Create a custom hook for better reusability**

```typescript
// src/hooks/useAppTranslation.ts
import { useTranslation } from '@weprodev/ui-localization';
import en from '../translations/en';

export const useAppTranslation = () => {
  return useTranslation<typeof en>();
};

// Usage in components
import { useAppTranslation } from '../hooks/useAppTranslation';

const Welcome: React.FC = () => {
  const { t } = useAppTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1> {/* Full intellisense and type safety */}
      <p>{t('common.hello')}</p>
      {/* t('common.invalid') will show TypeScript error */}
    </div>
  );
};
```

**Important:** For type-safe parameter validation to work, your translation files must use `as const`. This ensures TypeScript preserves literal string types, allowing the system to extract parameter names from placeholders like `{{name}}`.

**Troubleshooting:** If you encounter TypeScript errors with the type-safe hook, you can use `useTranslationFallback()` as an escape hatch. See the API Reference for details.

#### 5. Language Switching

```typescript
// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useLanguage } from '@weprodev/ui-localization';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  
  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {availableLanguages.map(lang => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
```

### React Native Applications

#### 1. Create Translation Files

Same structure as React applications (see above).

#### 2. Create Localization Configuration

`LanguageStore` is **synchronous** (`getLanguage(): string | null`, `setLanguage(language: string): void`). The language detector does not `await` promises. For AsyncStorage, hydrate into memory **before** `initLocalization`, then keep store reads/writes sync.

```typescript
// src/localizationConfig.ts
import { LocalizationConfig, LanguageStore } from '@weprodev/ui-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../translations/en';
import es from '../translations/es';

const STORAGE_KEY = 'app-language';

class ReactNativeLanguageStore implements LanguageStore {
  private language: string | null = null;

  /** Load persisted language before calling initLocalization. */
  async hydrate(): Promise<void> {
    try {
      this.language = await AsyncStorage.getItem(STORAGE_KEY);
    } catch {
      this.language = null;
    }
  }

  getLanguage(): string | null {
    return this.language;
  }

  setLanguage(language: string): void {
    this.language = language;
    void AsyncStorage.setItem(STORAGE_KEY, language).catch(() => {
      // Handle storage error silently
    });
  }
}

export const languageStore = new ReactNativeLanguageStore();

export const localizationConfig: LocalizationConfig = {
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  fallbackLng: 'en',
  languageStore
};
```

#### 3. Initialize Localization

```typescript
// src/App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { initLocalization } from '@weprodev/ui-localization';
import { languageStore, localizationConfig } from './localizationConfig';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    languageStore
      .hydrate()
      .then(() => initLocalization(localizationConfig))
      .then(() => {
        setIsInitialized(true);
      });
  }, []);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Your app content */}
    </View>
  );
};

export default App;
```

#### 4. Use Translations in React Native Components

```typescript
// src/components/Welcome.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '@weprodev/ui-localization';
import en from '../translations/en';

const Welcome: React.FC<{ name: string }> = ({ name }) => {
  // Type-safe translation hook with path-based keys
  const { t } = useTranslation<typeof en>();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('common.welcome', { name })}</Text>
      <Text style={styles.subtitle}>{t('common.hello', { name })}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default Welcome;
```

#### 5. Language Switching in React Native

```typescript
// src/components/LanguageSwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '@weprodev/ui-localization';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Language:</Text>
      <View style={styles.buttonContainer}>
        {availableLanguages.map(lang => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.button,
              currentLanguage === lang && styles.activeButton
            ]}
            onPress={() => changeLanguage(lang)}
          >
            <Text style={[
              styles.buttonText,
              currentLanguage === lang && styles.activeButtonText
            ]}>
              {lang.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
  },
});

export default LanguageSwitcher;
```

## 🔧 Advanced Usage

### Translation with Variables (Type-Safe Parameters)

The `t` function enforces type-safe parameters based on placeholders in your translation strings. Parameters are **required** when placeholders exist, and **optional** when they don't.

```typescript
import { useTranslation } from '@weprodev/ui-localization';
import en from '../translations/en';

const Greeting: React.FC<{ name: string }> = ({ name }) => {
  const { t } = useTranslation<typeof en>();
  
  // Translation: "common.greeting": "Hello, {{name}}!"
  // ✅ TypeScript requires the 'name' parameter
  const greeting = t('common.greeting', { name });
  
  // ❌ TypeScript error: missing required parameter 'name'
  // const greeting = t('common.greeting');
  
  // ❌ TypeScript error: wrong parameter name
  // const greeting = t('common.greeting', { wrongName: name });
  
  // ✅ No parameters needed for translations without placeholders
  const title = t('dashboard.title');
  
  return <p>{greeting}</p>;
};
```

### Translation with Component Interpolation

The unified `t` function supports both string and component interpolation. When you pass a `components` object as the third argument, it returns a React element instead of a string.

Define custom tags in the translation string and wrap the text that should be rendered by those components. Pass **React elements** (not function components) in the components map — tag keys must match, and each element should include a stable `key`.

```typescript
import { useTranslation } from '@weprodev/ui-localization';
import en from '../translations/en';

const Heading: React.FC = () => {
  const { t } = useTranslation<typeof en>();

  // Translation: "dashboard.heading": "<highlight>Dashboard</highlight> <bold>Overview</bold>"
  // No {{vars}} → pass undefined as the second argument
  return (
    <h1>
      {t('dashboard.heading', undefined, {
        highlight: <span className="highlight" key="highlight" />,
        bold: <span className="bold" key="bold" />,
      })}
    </h1>
  );
};

const ItemCount: React.FC<{ count: number; total: number }> = ({ count, total }) => {
  const { t } = useTranslation<typeof en>();

  // Translation: "<count>{{count}}</count> of {{total}} items"
  // Variables and components can be combined in the same call
  return (
    <p>
      {t(
        'dashboard.itemCount',
        { count, total },
        {
          count: <strong key="count" />,
        }
      )}
    </p>
  );
};

const WelcomeMessage: React.FC<{ name: string }> = ({ name }) => {
  const { t } = useTranslation<typeof en>();

  // Translation: "Welcome <strong>{{name}}</strong>! Please sign in to continue."
  return (
    <div>
      {t('auth.welcomeMessage', { name }, {
        strong: <strong className="highlight" key="strong" />,
      })}
    </div>
  );
};
```

**Important Notes:**
- Tag names in the translation string must match the keys in your `components` object (e.g. `<highlight>…</highlight>` ↔ `highlight: …`)
- Text between tags comes from the translation file; components only supply the wrapper/styling
- Pass React elements (with a `key`), not render functions / `props.children` handlers
- When there are no `{{variables}}`, pass `undefined` as the second argument


### Usage Outside React Components

For utility functions or other non-component files where hooks are not available, you can use `createTranslation` to get a type-safe `t` function.

```typescript
import { createTranslation } from '@weprodev/ui-localization';
import en from '../translations/en';

// Create a standalone translation function
const t = createTranslation<typeof en>();

// Basic usage - Returns string
const greeting = t('common.hello');

// With parameters - Returns string
const message = t('common.welcome', { name: 'World' });

// With components - Returns JSX.Element
// Text between tags comes from the translation; pass React elements with keys
const content = t('dashboard.heading', undefined, {
  highlight: <span className="highlight" key="highlight" />,
  bold: <span className="bold" key="bold" />,
});
```


## 🛠️ Translation Management Tools

The package includes powerful CLI tools to help manage your translations. You can use these tools in multiple ways:

### Option 1: Using NPM Scripts (Recommended)

Add these commands to your project's `package.json` scripts:

```json
{
  "scripts": {
    "translation:validate": "wpd-translation-validate --dir ./translations --source en",
    "translation:sync": "wpd-translation-sync --dir ./translations --source en"
  }
}
```

Then run:

```bash
npm run translation:validate
npm run translation:sync
```

**Customizing paths:**

Modify the scripts in your `package.json` to use different directories or source language:

```json
{
  "scripts": {
    "translation:validate": "wpd-translation-validate --dir ./src/translations --source es",
    "translation:sync": "wpd-translation-sync --dir ./src/translations --source es"
  }
}
```

### Option 2: Using npx (Direct CLI)

Run the CLI tools directly via npx:

```bash
# Validate translations
npx wpd-translation-validate --dir ./translations --source en

# Sync translations
npx wpd-translation-sync --dir ./translations --source en
```

### What These Tools Do

**Validate Translations** (`validate-translations`)
- Checks if all language files have the same keys as the source language
- Reports missing keys for each language file
- Exits with error code if inconsistencies are found
- Perfect for CI/CD integration

**Sync Translations** (`sync-translations`)
- Adds missing keys from the source language to all other language files
- Preserves existing translations
- Sets empty string values for new keys (ready for translation)
- Updates translation files automatically

### CI/CD Integration

We recommend running `translation:validate` as part of your CI pipeline to ensure translation consistency:

```yaml
# .github/workflows/ci.yml
- name: Validate Translations
  run: npm run translation:validate
```

## 📚 API Reference

### Hooks

#### `useTranslation<T>()`
Returns a type-safe translation function with intellisense support and type-safe parameter validation.

**Parameters:**
- None (the translation object type `T` is provided as a generic parameter for type safety)

**Returns:** Object with `t` function that accepts type-safe translation keys

**The `t` function supports two modes:**

1. **String interpolation** (returns `string`):
```typescript
import en from '../translations/en';

const { t } = useTranslation<typeof en>();

// No parameters needed for translations without placeholders
const title = t('dashboard.title'); // ✅ Returns string

// Parameters required when placeholders exist
const greeting = t('common.greeting', { name: 'John' }); // ✅ Returns string
const greeting = t('common.greeting'); // ❌ TypeScript error: missing required parameter
```

2. **Component interpolation** (returns `JSX.Element`):
```typescript
// Components only — no {{vars}}, so second arg is undefined
const heading = t('dashboard.heading', undefined, {
  highlight: <span className="highlight" key="highlight" />,
  bold: <span className="bold" key="bold" />,
}); // ✅ Returns JSX.Element

// Variables + components in the same call
const itemCount = t(
  'dashboard.itemCount',
  { count: 3, total: 10 },
  { count: <strong key="count" /> }
); // ✅ Returns JSX.Element
```

**Type-Safe Parameters:**
- Parameters are **required** when the translation string contains placeholders like `{{name}}`
- Parameters are **optional** when the translation has no placeholders
- TypeScript validates parameter names match the placeholders in the translation

**Note:** For better reusability, consider creating a custom hook:

```typescript
// src/hooks/useAppTranslation.ts
import { useTranslation } from '@weprodev/ui-localization';
import en from '../translations/en';

export const useAppTranslation = () => {
  return useTranslation<typeof en>();
};

// Usage
const { t } = useAppTranslation();
const text = t('common.welcome', { name: 'User' }); // Full type safety and intellisense
```

#### `useLanguage()`
Provides language management functionality.

```typescript
const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
```

#### `useTranslationFallback()`
**⚠️ Escape hatch hook - use only when the main `useTranslation` hook has TypeScript issues.**

Returns the raw i18next translation function without type safety. This should only be used in rare edge cases where the type-safe hook encounters problems.

```typescript
// Only use when useTranslation has TypeScript errors
const t = useTranslationFallback();
const text = t('common.hello'); // No type safety - standard i18next usage
const withVars = t('greeting', { name: 'John' });
```

**Note:** The main `useTranslation` hook should be preferred in 99% of cases.

### Core Functions

#### `initLocalization(config)`
Initializes the localization system.

```typescript
await initLocalization({
  resources: { en: { translation: enTranslations } },
  fallbackLng: 'en',
  languageStore: new CustomLanguageStore()
});
```

### Types

#### `LanguageStore`
Interface for custom language storage implementations.

```typescript
interface LanguageStore {
  getLanguage(): string | null;
  setLanguage(language: string): void;
}
```

#### `LocalizationConfig`
Configuration object for localization initialization.

```typescript
interface LocalizationConfig {
  resources: Resource;
  fallbackLng?: string;
  compatibilityJSON?: "v4";
  interpolation?: {
    escapeValue?: boolean;
  };
  languageStore?: LanguageStore;
}
```

#### `ComponentMap`
Type for component interpolation map. Prefer React elements with a stable `key` (as shown in the examples above). The type also allows function components for react-i18next `Trans` compatibility, but app usage should pass elements.

```typescript
type ComponentMap = {
  [key: string]: 
    | React.ReactElement
    | ((props: { children?: React.ReactNode; [key: string]: any }) => React.ReactElement)
}
```

#### `TranslateFunction<T>`
Type definition for the type-safe translation function.

```typescript
type TranslateFunction<T extends NestedRecord>
```

#### `UseTranslationReturn<T>`
Return type of the `useTranslation` hook.

```typescript
interface UseTranslationReturn<T extends NestedRecord> {
  t: TranslateFunction<T>;
}
```

#### `NestedRecord`
Base type for translation resources, allowing recursive nesting of primitive values.

```typescript
type NestedRecord = { 
  [key: string]: string | number | boolean | null | undefined | NestedRecord 
};
```


## 🆘 Support

For support, bug reports, or feature requests, please contact the WeProDev team or create an issue in our internal repository.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)

---

**@weprodev/ui-localization** - Professional localization solution by WeProDev
