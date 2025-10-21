import React from 'react';
import { renderHook } from '@testing-library/react';
import { useTranslationWithInterpolation } from '../../hooks/useTranslationWithInterpolation';

jest.mock('react-i18next', () => ({
  Trans: ({ i18nKey, ...props }: any) => 
    React.createElement('span', props, `Translated: ${i18nKey}`)
}));

describe('useTranslationWithInterpolation', () => {
  it('should create a memoized component', () => {
    const { result } = renderHook(() => 
      useTranslationWithInterpolation('welcome', {}, {})
    );
    
    expect(result.current).toBeDefined();
    expect(React.isValidElement(result.current)).toBe(true);
  });

  it('should pass correct props to Trans component', () => {
    const variables = { name: 'John' };
    const components = { strong: <strong /> };
    
    const { result } = renderHook(() => 
      useTranslationWithInterpolation('welcome', variables, components)
    );
    
    expect(result.current).toBeDefined();
    expect(React.isValidElement(result.current)).toBe(true);
  });

  it('should handle default parameters', () => {
    const { result } = renderHook(() => 
      useTranslationWithInterpolation('simple')
    );
    
    expect(result.current).toBeDefined();
    expect(React.isValidElement(result.current)).toBe(true);
  });

  it('should memoize the result based on dependencies', () => {
    const variables = { name: 'John' };
    const components = { strong: <strong /> };
    
    const { result, rerender } = renderHook(
      ({ key, vars, comps }) => 
        useTranslationWithInterpolation(key, vars, comps),
      {
        initialProps: { key: 'welcome', vars: variables, comps: components }
      }
    );
    
    const firstResult = result.current;
    
    rerender({ key: 'welcome', vars: variables, comps: components });
    
    expect(result.current).toBe(firstResult);
    
    rerender({ key: 'goodbye', vars: variables, comps: components });
    
    expect(result.current).not.toBe(firstResult);
  });
});