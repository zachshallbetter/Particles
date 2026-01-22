import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle, rafThrottle } from './throttle.utils';

describe('throttle.utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('throttle', () => {
    it('should call function immediately on first call', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should throttle subsequent calls within delay period', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments correctly', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled('arg1', 'arg2');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should maintain context', () => {
      const obj = {
        value: 42,
        method: function (this: { value: number }) {
          return this.value;
        },
      };
      const throttled = throttle(obj.method.bind(obj), 100);

      expect(throttled()).toBe(42);
    });

    it('should handle rapid calls correctly', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      // Call 10 times rapidly
      for (let i = 0; i < 10; i++) {
        throttled();
      }

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('rafThrottle', () => {
    it('should use requestAnimationFrame for throttling', () => {
      const fn = vi.fn();
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        setTimeout(cb, 16);
        return 1;
      });
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

      const throttled = rafThrottle(fn);

      throttled();
      expect(rafSpy).toHaveBeenCalled();

      rafSpy.mockRestore();
      cancelSpy.mockRestore();
    });

    it('should cancel previous animation frame on rapid calls', () => {
      const fn = vi.fn();
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

      const throttled = rafThrottle(fn);

      throttled();
      throttled();
      throttled();

      expect(cancelSpy).toHaveBeenCalled();

      cancelSpy.mockRestore();
    });

    it('should pass arguments correctly', () => {
      const fn = vi.fn();
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        cb(performance.now());
        return 1;
      });

      const throttled = rafThrottle(fn);

      throttled('arg1', 'arg2');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');

      rafSpy.mockRestore();
    });
  });
});
