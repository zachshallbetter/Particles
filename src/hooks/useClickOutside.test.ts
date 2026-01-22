import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect clicks outside element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const handler = vi.fn();
    
    const { result } = renderHook(() => useClickOutside(element, handler));
    expect(result.current).toBeDefined();

    // Simulate click outside
    document.body.click();
    expect(handler).toHaveBeenCalled();
  });

  it('should not trigger on clicks inside element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const handler = vi.fn();
    
    renderHook(() => useClickOutside(element, handler));

    // Simulate click inside
    element.click();
    expect(handler).not.toHaveBeenCalled();
  });
});
