# @weprodev/wpd-pkg-localization

A lightweight localization package for React and React Native applications based on i18next.

## Features

- 🌐 Simple React hooks for translations
- 🔄 Support for language switching
- 📝 String injection
- 🧩 Component interpolation
- 🔍 Translation validation tools
- 🔄 Translation sync utilities

## Installation

### 1. Configure GitHub Packages Authentication

Create or update `.npmrc` in your project root:

```
@weprodev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Set your GitHub Personal Access Token with `read:packages` scope:

```bash
# macOS/Linux
export NPM_TOKEN=your_github_token

# Windows (PowerShell)
setx NPM_TOKEN "your_github_token"
```

### 2. Install the package

```bash
npm install @weprodev/wpd-pkg-localization
```

## Setup

### 1. Create translation files

Create a `translations` directory in your project with language files:

```ts
// translations/en.ts
const en = {
  common: {
    hello: "Hello",
    welcome: "Welcome"
  },
  // Add more translation keys as needed
};

export default en;
```

```ts
// translations/fr.ts
const fr = {
  common: {
    hello: "Bonjour",
    welcome: "Bienvenue"
  },
  // Add more translation keys as needed
};

export default fr;
```

### 2. Create localization configuration

```tsx
// src/localizationConfig.ts
import { LocalizationConfig, LanguageStore } from '@weprodev/wpd-pkg-localization';
import en from './translations/en';
import fr from './translations/fr';

// Optional: Create a custom language store
class MyLanguageStore implements LanguageStore {
  getLanguage(): string | null {
    return localStorage.getItem("language") || null;
  }

  setLanguage(language: string): void {
    localStorage.setItem("language", language);
  }
}

export const localizationConfig: LocalizationConfig = {
  resources: {
    en: { translation: en },
    fr: { translation: fr }
  },
  fallbackLng: 'en',
  languageStore: new MyLanguageStore()
};
```

### 3. Initialize localization in your app

```tsx
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

## Usage

### Basic Translation

```tsx
// Optional: Create a type-safe translation hook
// src/hooks/useTranslation.ts
import { useTranslation as useTranslationBase } from '@weprodev/wpd-pkg-localization';
import en from '../translations/en';

export const useTranslation = () => {
  return useTranslationBase<typeof en>(en);
};

// Usage in components
import { useTranslation } from '../hooks/useTranslation';

function Welcome() {
  const t = useTranslation();
  
  return <h1>{t.common.welcome}</h1>;
}
```

### Changing Language

```tsx
import { useLanguage } from '@weprodev/wpd-pkg-localization';

function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  
  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {availableLanguages.map(lang => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  );
}
```

### Translation with Variables

```tsx
import { useTranslation } from '../hooks/useTranslation';
import { useTranslationInjection } from '@weprodev/wpd-pkg-localization';

function Greeting({ name }) {
  const t = useTranslation();
  
  // Assuming you have a translation key: "greeting": "Hello, {{name}}!"
  const greeting = useTranslationInjection(t.common.greeting, { name });
  
  return <p>{greeting}</p>;
}
```

### Translation with Components

```tsx
import { useTranslation } from '../hooks/useTranslation';
import { useTranslationWithInterpolation } from '@weprodev/wpd-pkg-localization';

function TermsAgreement({ name }) {
  const t = useTranslation();
  
  // Assuming you have a translation key: "welcome": "Welcome <strong>{{name}}</strong>"
  const welcomeElement = useTranslationWithInterpolation(t.common.welcome, { name }, {
    strong: <strong style={{ color: "red" }} />
  });
  
  return <div>{welcomeElement}</div>;
}
```

## Translation Management Tools

The package includes two CLI tools to help manage translations:

### Validate Translations

Checks if all language files have the same keys as the source language:

```bash
npx wpd-translation-validate --dir ./translations --source en
```

### Sync Translations

Adds missing keys from the source language to all other language files (with empty strings for missing translations):

```bash
npx wpd-translation-sync --dir ./translations --source en
```

You can also add these commands to your package.json scripts:

```json
"scripts": {
  "translation:validate": "wpd-translation-validate --dir ./translations --source en",
  "translation:sync": "wpd-translation-sync --dir ./translations --source en"
}
```

## License

MIT
