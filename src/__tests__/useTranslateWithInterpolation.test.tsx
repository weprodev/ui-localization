/// <reference types="jest" />
import React from 'react';
import { renderHook } from '@testing-library/react';
import { useTranslation, Trans } from 'react-i18next';
import useTranslateWithInterpolation from '../useTranslateWithInterpolation';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
  Trans: jest.fn(),
}));

const mockedUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
const mockedTrans = Trans as jest.MockedFunction<typeof Trans>;

// Helper function to execute hook and get result
function executeHook(key: string, variables?: any, components?: any) {
  const { result } = renderHook(() => useTranslateWithInterpolation(key, variables, components));
  // The hook returns a JSX element, we need to access its props
  const jsxElement = result.current;
  return {
    _testProps: {
      i18nKey: jsxElement.props.i18nKey,
      values: jsxElement.props.values || {},
      components: jsxElement.props.components || {},
    }
  };
}

describe('useTranslateWithInterpolation', () => {
  const mockT = jest.fn();

  beforeEach(() => {
    mockedUseTranslation.mockReturnValue({
      t: mockT as any,
      i18n: {
        language: 'en',
        languages: ['en', 'es'],
        changeLanguage: jest.fn(),
        getResourceBundle: jest.fn(),
        addResourceBundle: jest.fn(),
      } as any,
      ready: true,
    } as any);

    // Mock Trans component to capture its props for testing
    mockedTrans.mockImplementation(({ i18nKey, values, components }) => {
      // Create a mock React Native Text element that preserves the test props
      const mockElement = React.createElement('Text', {
        testID: 'trans-component',
        accessibilityLabel: i18nKey,
      });
      
      // Store props for testing
      (mockElement as any)._testProps = {
        i18nKey,
        values: values || {},
        components: components || {},
      };
      
      return mockElement;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should render Trans component with correct i18nKey', () => {
      const result = executeHook('welcome.message');
      
      expect((result as any)._testProps.i18nKey).toBe('welcome.message');
    });

    it('should call useTranslation hook', () => {
      executeHook('test.key');
      expect(mockedUseTranslation).toHaveBeenCalled();
    });

    it('should return JSX element', () => {
      const { result } = renderHook(() => useTranslateWithInterpolation('test.key'));
      expect(React.isValidElement(result.current)).toBe(true);
    });
  });

  describe('variables handling', () => {
    it('should pass variables to Trans component', () => {
      const variables = { name: 'John', count: 5 };
      const result = executeHook('greeting', variables);
      
      expect((result as any)._testProps.values).toEqual(variables);
    });

    it('should handle empty variables object', () => {
      const result = executeHook('test.key', {});
      expect((result as any)._testProps.values).toEqual({});
    });

    it('should handle undefined variables', () => {
      const result = executeHook('test.key');
      expect((result as any)._testProps.values).toEqual({});
    });

    it('should handle complex variable types', () => {
      const variables = {
        string: 'text',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
      };
      
      const result = executeHook('complex.key', variables);
      expect((result as any)._testProps.values).toEqual(variables);
    });
  });

  describe('components handling', () => {
    it('should pass components to Trans component', () => {
      const components = {
        bold: <strong />,
        link: <a href="#" />,
      };
      
      const result = executeHook('rich.text', {}, components);
      expect((result as any)._testProps.components).toEqual(components);
    });

    it('should handle empty components object', () => {
      const result = executeHook('test.key', {}, {});
      expect((result as any)._testProps.components).toEqual({});
    });

    it('should handle undefined components', () => {
      const result = executeHook('test.key', {});
      expect((result as any)._testProps.components).toEqual({});
    });

    it('should handle various React components', () => {
      const components = {
        span: <span className="highlight" />,
        div: <div style={{ color: 'red' }} />,
        button: <button onClick={() => {}} />,
        custom: <div data-custom="true" />,
      };
      
      const result = executeHook('component.test', {}, components);
      const componentKeys = Object.keys((result as any)._testProps.components);
      expect(componentKeys).toEqual(['span', 'div', 'button', 'custom']);
    });
  });

  describe('combined usage', () => {
    it('should handle both variables and components together', () => {
      const variables = { name: 'Alice', count: 3 };
      const components = { bold: <strong />, italic: <em /> };
      
      const result = executeHook('combined.message', variables, components);
      expect((result as any)._testProps.i18nKey).toBe('combined.message');
      expect((result as any)._testProps.values).toEqual(variables);
      expect((result as any)._testProps.components).toEqual(components);
    });

    it('should handle complex nested scenarios', () => {
      const variables = {
        user: { name: 'Bob', role: 'admin' },
        items: ['item1', 'item2'],
        config: { theme: 'dark', lang: 'en' },
      };
      const components = {
        wrapper: <div className="wrapper" />,
        highlight: <span className="highlight" />,
        link: <a href="/profile" />,
      };
      
      const result = executeHook('complex.scenario', variables, components);
      expect((result as any)._testProps.values).toEqual(variables);
      expect((result as any)._testProps.components).toEqual(components);
    });
  });

  describe('memoization', () => {
    it('should create new result when key changes', () => {
      const result1 = executeHook('first.key');
      const result2 = executeHook('second.key');
      
      expect((result1 as any)._testProps.i18nKey).toBe('first.key');
      expect((result2 as any)._testProps.i18nKey).toBe('second.key');
    });

    it('should create new result when variables change', () => {
      const result1 = executeHook('test.key', { name: 'Alice' });
      const result2 = executeHook('test.key', { name: 'Bob' });
      
      expect((result1 as any)._testProps.values).toEqual({ name: 'Alice' });
      expect((result2 as any)._testProps.values).toEqual({ name: 'Bob' });
    });

    it('should create new result when components change', () => {
      const result1 = executeHook('test.key', {}, { bold: <strong /> });
      const result2 = executeHook('test.key', {}, { italic: <em /> });
      
      expect(Object.keys((result1 as any)._testProps.components)).toEqual(['bold']);
      expect(Object.keys((result2 as any)._testProps.components)).toEqual(['italic']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string key', () => {
      const result = executeHook('');
      expect((result as any)._testProps.i18nKey).toBe('');
    });

    it('should handle special characters in key', () => {
      const specialKey = 'test.key-with_special.chars:and@symbols';
      const result = executeHook(specialKey);
      expect((result as any)._testProps.i18nKey).toBe(specialKey);
    });

    it('should handle null values in variables', () => {
      const variables = { nullValue: null, undefinedValue: undefined };
      const result = executeHook('test.key', variables);
      expect((result as any)._testProps.values).toEqual(variables);
    });

    it('should handle function values in variables', () => {
      const variables = {
        callback: () => 'test',
        value: 'normal',
      };
      
      expect(() => executeHook('test.key', variables)).not.toThrow();
    });
  });

  describe('type safety', () => {
    it('should accept string keys', () => {
      expect(() => executeHook('valid.string.key')).not.toThrow();
    });

    it('should accept various variable types', () => {
      const variables = {
        str: 'string',
        num: 123,
        bool: true,
        arr: [1, 2, 3],
        obj: { nested: true },
      };
      expect(() => executeHook('test.key', variables)).not.toThrow();
    });

    it('should accept React elements as components', () => {
      const components = {
        element: <div />,
        withProps: <span className="test" />,
        withChildren: <p>Content</p>,
      };
      expect(() => executeHook('test.key', {}, components)).not.toThrow();
    });
  });
});