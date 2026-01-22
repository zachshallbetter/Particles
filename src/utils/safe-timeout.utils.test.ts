import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  safeSetTimeout,
  safeClearTimeout,
  safeSetInterval,
  safeClearInterval,
} from './safe-timeout.utils';

describe('safe-timeout.utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('safeSetTimeout', () => {
    it('should set timeout safely', () => {
      const fn = vi.fn();
      const id = safeSetTimeout(fn, 100);
      expect(id).toBeDefined();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalled();
    });

    it('should handle cleanup on unmount', () => {
      const fn = vi.fn();
      const id = safeSetTimeout(fn, 100);
      safeClearTimeout(id);
      vi.advanceTimersByTime(100);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('safeSetInterval', () => {
    it('should set interval safely', () => {
      const fn = vi.fn();
      const id = safeSetInterval(fn, 100);
      expect(id).toBeDefined();

      vi.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should handle cleanup', () => {
      const fn = vi.fn();
      const id = safeSetInterval(fn, 100);
      safeClearInterval(id);
      vi.advanceTimersByTime(200);
      expect(fn).not.toHaveBeenCalled();
    });
  });
});
