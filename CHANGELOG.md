# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-20

### 🚨 Breaking Changes

#### Removed Hooks
- **Removed `useTranslationWithInterpolation` hook** - Functionality merged into `useTranslation`
- **Removed `useTranslationInjection` hook** - Functionality merged into `useTranslation`

#### `useTranslation` API Changes
The `useTranslation` hook has been completely refactored with a new API:

**Before (v1.0.0):**
```typescript
const t = useTranslation<typeof en>(en);
const welcome = t.common.welcome; // Proxy-based access
```

**After (v2.0.0):**
```typescript
const { t } = useTranslation<typeof en>();
const welcome = t('common.welcome'); // Function-based access
```

**Migration Guide:**
- Remove the translation object parameter from `useTranslation`
- Change from property access (`t.common.welcome`) to function calls (`t('common.welcome')`)
- The hook now returns an object with a `t` function instead of a proxy object
- Variable injection and component interpolation are now handled through the same `t` function

### ✨ Added

- **`createTranslation` utility** - New utility function for creating type-safe translation functions outside of React components
- **Enhanced type safety** - Improved TypeScript types with `Path`, `PathValue`, `TranslateFunction`, and `ComponentMap`
- **Unified API** - Single `t` function now handles both variable injection and component interpolation
- **React component support** - Built-in support for embedding React components within translations using the `Trans` component

### 🔄 Changed

- **Simplified `useTranslation` hook** - Reduced from 65 lines to 36 lines, improved maintainability
- **Streamlined exports** - Cleaner export structure in `index.ts`
- **Enhanced type definitions** - Expanded `types.ts` with comprehensive type utilities for better type safety

### 📝 Documentation

- Updated README.md with new API examples and usage patterns
- Added comprehensive examples for type-safe translations
- Clarified variable injection and component interpolation sections

## [1.0.0] - Previous Release

Initial stable release with:
- Basic translation hooks
- Language switching functionality
- Translation validation and sync tools
- React and React Native support

