import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle keyboard navigation', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        onArrowUp: vi.fn(),
        onArrowDown: vi.fn(),
        onArrowLeft: vi.fn(),
        onArrowRight: vi.fn(),
      })
    );
    expect(result.current).toBeDefined();
  });

  it('should call handlers on key press', () => {
    const onArrowUp = vi.fn();
    const { result } = renderHook(() =>
      useKeyboardNavigation({ onArrowUp })
    );
    // Simulate key press
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event);
    // Handler should be called
    expect(onArrowUp).toHaveBeenCalled();
  });
});
