# @weprodev/wpd-pkg-localization

A lightweight, professional localization package for React and React Native applications built on top of i18next and react-i18next. This package provides a clean, type-safe API for managing translations with built-in language switching, variable injection, and component interpolation capabilities.

## ✨ Features

- 🌐 **Simple React Hooks** - Clean, intuitive hooks for translations and language management
- 🔄 **Language Switching** - Built-in language switching with persistence
- 📝 **Variable Injection** - Dynamic content insertion in translations
- 🧩 **Component Interpolation** - Embed React components within translations
- 🔍 **Translation Validation** - CLI tools to ensure translation consistency
- 🔄 **Translation Sync** - Automated synchronization of translation files
- 📱 **React Native Support** - Full compatibility with React Native applications
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive type definitions
- ⚡ **Performance Optimized** - Lightweight wrapper with minimal overhead

## 📦 Installation

### Prerequisites

This package is published to GitHub Packages and requires authentication to install.

### 1. Configure GitHub Packages Authentication

Create or update `.npmrc` in your project root:

```bash
@weprodev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

### 2. Create a GitHub Personal Access Token

If you don't have a GitHub Personal Access Token, follow [GitHub's official guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) to create one with the `read:packages` scope.

Set your token as an environment variable:

```bash
# macOS/Linux
export NPM_TOKEN=your_github_token

# Windows (PowerShell)
setx NPM_TOKEN "your_github_token"

# Windows (Command Prompt)
set NPM_TOKEN=your_github_token
```

### 3. Install the Package

```bash
npm install @weprodev/wpd-pkg-localization
```

## 🚀 Quick Start

### React Applications

#### 1. Create Translation Files

Create a `translations` directory in your project with language files:

```typescript
// translations/en.ts
const en = {
  common: {
    hello: "Hello",
    welcome: "Welcome to our app",
    goodbye: "Goodbye"
  },
  auth: {
    login: "Login",
    signup: "Sign Up",
    forgotPassword: "Forgot Password"
  },
  dashboard: {
    title: "Dashboard",
    summary: "Summary",
    recentActivity: "Recent Activity"
  }
};

export default en;
```

```typescript
// translations/es.ts
const es = {
  common: {
    hello: "Hola",
    welcome: "Bienvenido a nuestra aplicación",
    goodbye: "Adiós"
  },
  auth: {
    login: "Iniciar sesión",
    signup: "Registrarse",
    forgotPassword: "Contraseña olvidada"
  },
  dashboard: {
    title: "Panel de control",
    summary: "Resumen",
    recentActivity: "Actividad reciente"
  }
};

export default es;
```

#### 2. Create Localization Configuration

```typescript
// src/localizationConfig.ts
import { LocalizationConfig, LanguageStore } from '@weprodev/wpd-pkg-localization';
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
import { initLocalization } from '@weprodev/wpd-pkg-localization';
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
import { useTranslation } from '@weprodev/wpd-pkg-localization';

const Welcome: React.FC = () => {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.hello')}</p>
    </div>
  );
};

export default Welcome;
```

#### 5. Language Switching

```typescript
// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useLanguage } from '@weprodev/wpd-pkg-localization';

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

```typescript
// src/localizationConfig.ts
import { LocalizationConfig, LanguageStore } from '@weprodev/wpd-pkg-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../translations/en';
import es from '../translations/es';

// React Native language store using AsyncStorage
class ReactNativeLanguageStore implements LanguageStore {
  async getLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("app-language");
    } catch {
      return null;
    }
  }

  async setLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem("app-language", language);
    } catch {
      // Handle storage error silently
    }
  }
}

export const localizationConfig: LocalizationConfig = {
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  fallbackLng: 'en',
  languageStore: new ReactNativeLanguageStore()
};
```

#### 3. Initialize Localization

```typescript
// src/App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { initLocalization } from '@weprodev/wpd-pkg-localization';
import { localizationConfig } from './localizationConfig';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initLocalization(localizationConfig).then(() => {
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
import { useTranslation } from '@weprodev/wpd-pkg-localization';

const Welcome: React.FC = () => {
  const t = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('common.welcome')}</Text>
      <Text style={styles.subtitle}>{t('common.hello')}</Text>
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
import { useLanguage } from '@weprodev/wpd-pkg-localization';

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

### Translation with Variables

```typescript
import { useTranslationInjection } from '@weprodev/wpd-pkg-localization';

const Greeting: React.FC<{ name: string }> = ({ name }) => {
  // Translation key: "greeting": "Hello, {{name}}!"
  const greeting = useTranslationInjection('common.greeting', { name });
  
  return <p>{greeting}</p>;
};
```

### Translation with Components

```typescript
import { useTranslationWithInterpolation } from '@weprodev/wpd-pkg-localization';

const TermsAgreement: React.FC<{ name: string }> = ({ name }) => {
  // Translation key: "welcome": "Welcome <strong>{{name}}</strong>"
  const welcomeElement = useTranslationWithInterpolation(
    'common.welcome', 
    { name }, 
    {
      strong: <strong style={{ color: "red" }} />
    }
  );
  
  return <div>{welcomeElement}</div>;
};
```


## 🛠️ Translation Management Tools

The package includes powerful CLI tools to help manage your translations:

### Validate Translations

Check if all language files have the same keys as the source language:

```bash
npx wpd-translation-validate --dir ./translations --source en
```

### Sync Translations

Add missing keys from the source language to all other language files:

```bash
npx wpd-translation-sync --dir ./translations --source en
```

### Package.json Scripts

Add these commands to your `package.json` scripts for convenience:

```json
{
  "scripts": {
    "translation:validate": "wpd-translation-validate --dir ./translations --source en",
    "translation:sync": "wpd-translation-sync --dir ./translations --source en"
  }
}
```

### CI/CD Integration

We recommend running `translation:validate` as part of your CI pipeline to ensure translation consistency:

```yaml
# .github/workflows/ci.yml
- name: Validate Translations
  run: npm run translation:validate
```

## 📚 API Reference

### Hooks

#### `useTranslation()`
Returns the translation function from react-i18next.

```typescript
const t = useTranslation();
const translatedText = t('common.hello');
```

#### `useLanguage()`
Provides language management functionality.

```typescript
const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
```

#### `useTranslationInjection(key, variables)`
Injects variables into translation strings.

```typescript
const result = useTranslationInjection('greeting', { name: 'John' });
```

#### `useTranslationWithInterpolation(key, variables, components)`
Interpolates React components into translations.

```typescript
const element = useTranslationWithInterpolation(
  'welcome', 
  { name: 'John' }, 
  { strong: <strong /> }
);
```

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

## 🆘 Support

For support, bug reports, or feature requests, please contact the WeProDev team or create an issue in our internal repository.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)

---

**@weprodev/wpd-pkg-localization** - Professional localization solution by WeProDev