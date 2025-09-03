// React import not needed
import { useTranslation } from 'react-i18next';
import useTranslationInjection from '../useTranslationInjection';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

const mockedUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

describe('useTranslationInjection', () => {
  let mockT: jest.MockedFunction<any>;

  beforeEach(() => {
    mockT = jest.fn();
    mockedUseTranslation.mockReturnValue({
      t: mockT,
      i18n: {
        language: 'en',
        languages: ['en', 'es'],
        changeLanguage: jest.fn(),
        getResourceBundle: jest.fn(),
        addResourceBundle: jest.fn(),
      } as any,
      ready: true,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to execute the hook
  const executeHook = (key: string | string[], variables: any) => {
    return useTranslationInjection(key, variables);
  };

  describe('Basic functionality', () => {
    it('should call t function with key and variables', () => {
      const key = 'hello';
      const variables = { name: 'World' };
      mockT.mockReturnValue('Hello World');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('Hello World');
    });

    it('should return translated string', () => {
      const key = 'greeting';
      const variables = { user: 'John' };
      const expectedTranslation = 'Hello John';
      mockT.mockReturnValue(expectedTranslation);

      const result = executeHook(key, variables);

      expect(result).toBe(expectedTranslation);
    });
  });

  describe('Variable handling', () => {
    it('should handle empty variables object', () => {
      const key = 'simple';
      const variables = {};
      mockT.mockReturnValue('Simple text');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('Simple text');
    });

    it('should handle complex variables', () => {
      const key = 'complex';
      const variables = {
        count: 5,
        name: 'Test',
        nested: { value: 'nested' },
        array: [1, 2, 3],
      };
      mockT.mockReturnValue('Complex translation');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('Complex translation');
    });

    it('should handle variables with special characters', () => {
      const key = 'special';
      const variables = {
        symbol: '@#$%',
        unicode: '🌟',
        rtl: 'مرحبا',
      };
      mockT.mockReturnValue('Special translation');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('Special translation');
    });
  });

  describe('Array keys', () => {
    it('should handle array of keys', () => {
      const keys = ['key1', 'key2', 'key3'];
      const variables = { value: 'test' };
      mockT.mockReturnValue('Array key translation');

      const result = executeHook(keys, variables);

      expect(mockT).toHaveBeenCalledWith(keys, variables);
      expect(result).toBe('Array key translation');
    });

    it('should handle empty array of keys', () => {
      const keys: string[] = [];
      const variables = { value: 'test' };
      mockT.mockReturnValue('Empty array translation');

      const result = executeHook(keys, variables);

      expect(mockT).toHaveBeenCalledWith(keys, variables);
      expect(result).toBe('Empty array translation');
    });

    it('should handle single item array', () => {
      const keys = ['singleKey'];
      const variables = { value: 'single' };
      mockT.mockReturnValue('Single key translation');

      const result = executeHook(keys, variables);

      expect(mockT).toHaveBeenCalledWith(keys, variables);
      expect(result).toBe('Single key translation');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string key', () => {
      const key = '';
      const variables = {};
      mockT.mockReturnValue('');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('');
    });

    it('should handle key with dots (nested keys)', () => {
      const key = 'nested.deep.key';
      const variables = { value: 'nested' };
      mockT.mockReturnValue('Nested translation');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('Nested translation');
    });

    it('should handle null values in variables', () => {
      const key = 'nullTest';
      const variables = {
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        zero: 0,
        false: false,
      };
      mockT.mockReturnValue('Null handling translation');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('Null handling translation');
    });

    it('should handle function values in variables', () => {
      const key = 'functionTest';
      const variables = {
        callback: () => 'callback result',
        formatter: (value: string) => value.toUpperCase(),
      };
      mockT.mockReturnValue('Function handling translation');

      const result = executeHook(key, variables);

      expect(mockT).toHaveBeenCalledWith(key, variables);
      expect(result).toBe('Function handling translation');
    });
  });

  describe('Integration with useTranslation', () => {
    it('should use the t function from useTranslation hook', () => {
      const key = 'integration';
      const variables = { test: 'value' };
      mockT.mockReturnValue('Integration test');

      executeHook(key, variables);

      expect(mockedUseTranslation).toHaveBeenCalled();
      expect(mockT).toHaveBeenCalledWith(key, variables);
    });

    it('should work with different t function implementations', () => {
      const key = 'different';
      const variables = { impl: 'test' };
      
      // Mock different t function behavior
      mockT.mockImplementation((k: any, v: any) => `${k}_${JSON.stringify(v)}`);

      const result = executeHook(key, variables);

      expect(result).toBe('different_{"impl":"test"}');
    });
  });

  describe('Type safety', () => {
    it('should handle string keys correctly', () => {
      const key: string = 'stringKey';
      const variables = { type: 'string' };
      mockT.mockReturnValue('String key result');

      const result = executeHook(key, variables);

      expect(typeof result).toBe('string');
      expect(result).toBe('String key result');
    });

    it('should handle array keys correctly', () => {
      const keys: string[] = ['array', 'key'];
      const variables = { type: 'array' };
      mockT.mockReturnValue('Array key result');

      const result = executeHook(keys, variables);

      expect(typeof result).toBe('string');
      expect(result).toBe('Array key result');
    });
  });

  describe('Performance considerations', () => {
    it('should not cause unnecessary re-renders', () => {
      const key = 'performance';
      const variables = { test: 'perf' };
      mockT.mockReturnValue('Performance test');

      // Call multiple times with same parameters
      executeHook(key, variables);
      executeHook(key, variables);
      executeHook(key, variables);

      // Each call should still call the t function
      expect(mockT).toHaveBeenCalledTimes(3);
      expect(mockT).toHaveBeenCalledWith(key, variables);
    });
  });
});