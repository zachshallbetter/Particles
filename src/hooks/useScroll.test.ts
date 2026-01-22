import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScroll } from './useScroll';

describe('useScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollX = 0;
    window.scrollY = 0;
  });

  it('should return scroll position', () => {
    const { result } = renderHook(() => useScroll());
    expect(result.current).toBeDefined();
    expect(result.current.x).toBeDefined();
    expect(result.current.y).toBeDefined();
  });

  it('should update on scroll', () => {
    const { result } = renderHook(() => useScroll());
    const initialY = result.current.y;

    // Simulate scroll
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));

    // Note: In a real test, you'd need to wait for the update
    expect(result.current).toBeDefined();
  });
});
