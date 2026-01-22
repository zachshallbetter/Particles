import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useExperiment } from './useExperiment';

describe('useExperiment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize experiment', () => {
    const { result } = renderHook(() => useExperiment('test-experiment'));
    expect(result.current).toBeDefined();
  });

  it('should provide experiment controls', () => {
    const { result } = renderHook(() => useExperiment('test-experiment'));
    expect(result.current.config).toBeDefined();
    expect(result.current.updateConfig).toBeDefined();
  });
});
