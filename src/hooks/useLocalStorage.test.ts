import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  const key = 'test-key';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should initialize with stored value', () => {
    localStorage.setItem(key, JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage(key, 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update value', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem(key)).toBe(JSON.stringify('new-value'));
  });

  it('should handle objects', () => {
    const { result } = renderHook(() => useLocalStorage(key, { a: 1 }));
    
    act(() => {
      result.current[1]({ a: 2, b: 3 });
    });

    expect(result.current[0]).toEqual({ a: 2, b: 3 });
  });

  it('should handle removal', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'default'));
    
    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
    expect(localStorage.getItem(key)).toBeNull();
  });
});
