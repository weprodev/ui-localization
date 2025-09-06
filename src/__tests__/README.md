# Testing Documentation

This directory contains tests for the `@weprodev/wpd-pkg-localization` package.

## Structure

- `__tests__/core/` - Tests for core functionality
- `__tests__/hooks/` - Tests for React hooks
- `__tests__/__mocks__/` - Mock implementations and test utilities

## Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific file or pattern
npm test -- -t DefaultLanguageStore

# Run tests with coverage
npm test -- --coverage
```

## Test Setup

The test environment is configured in `jest.config.js` at the project root. It uses:

- `ts-jest` for TypeScript support
- `jsdom` for DOM emulation (for React hooks)

## Writing Tests

When writing tests:

1. Create test files with `.test.ts` or `.test.tsx` extensions
2. Place tests in the appropriate directory matching the source structure
3. Use descriptive test names that explain the expected behavior
4. For React hooks, use `@testing-library/react` utilities

## Mocks

Common mocks are available in `__tests__/__mocks__/mocks.ts`:

- `MockLanguageStore` - A mock implementation of the `LanguageStore` interface
- `createTestResources` - Helper to create test translation resources