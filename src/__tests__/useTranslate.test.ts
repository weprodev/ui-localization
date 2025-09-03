import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import useTranslate from '../useTranslate';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

describe('useTranslate', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return translation proxy', () => {
    const mockT = jest.fn().mockReturnValue('translated text');
    
    mockUseTranslation.mockReturnValue({
      t: mockT,
    } as any);

    const { result } = renderHook(() => useTranslate({ test: 'value' }));

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('should call useTranslation hook', () => {
    const mockT = jest.fn() as any;
    
    mockUseTranslation.mockReturnValue({
      t: mockT,
    } as any);

    renderHook(() => useTranslate({}));

    expect(mockUseTranslation).toHaveBeenCalledTimes(1);
  });
});