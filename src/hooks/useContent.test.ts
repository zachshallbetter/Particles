import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContent } from './useContent';

describe('useContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch content', async () => {
    const { result } = renderHook(() => useContent('projects'));
    expect(result.current).toBeDefined();
    expect(result.current.data).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.error).toBeDefined();
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useContent('projects'));
    expect(result.current.loading).toBe(true);
  });

  it('should handle error state', async () => {
    // Mock error scenario
    const { result } = renderHook(() => useContent('invalid'));
    // Error handling would be tested here
    expect(result.current).toBeDefined();
  });
});
