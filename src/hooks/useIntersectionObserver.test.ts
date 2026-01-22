import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should observe element intersection', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() =>
      useIntersectionObserver(element, { threshold: 0.5 })
    );
    expect(result.current).toBeDefined();
    expect(result.current.isIntersecting).toBeDefined();
    expect(result.current.intersectionRatio).toBeDefined();
  });

  it('should handle null element', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver(null, { threshold: 0.5 })
    );
    expect(result.current).toBeDefined();
  });
});
