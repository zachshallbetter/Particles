import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(9);
  });

  it('should reset count', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(0);
  });

  it('should set count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.setCount(5);
    });

    expect(result.current.count).toBe(5);
  });
});
