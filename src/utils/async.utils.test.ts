import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay, retry, timeout, debounce } from './async.utils';

describe('async.utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const promise = delay(100);
      vi.advanceTimersByTime(100);
      await promise;
      expect(true).toBe(true); // If we get here, delay worked
    });
  });

  describe('retry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const fn = vi.fn(async () => {
        attempts++;
        if (attempts < 3) throw new Error('Failed');
        return 'success';
      });

      const result = await retry(fn, { maxAttempts: 3, delay: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should fail after max attempts', async () => {
      const fn = vi.fn(async () => {
        throw new Error('Failed');
      });

      await expect(retry(fn, { maxAttempts: 3, delay: 10 })).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe('timeout', () => {
    it('should timeout slow operations', async () => {
      const slowFn = async () => {
        await delay(200);
        return 'done';
      };

      await expect(timeout(slowFn, 100)).rejects.toThrow();
    });

    it('should not timeout fast operations', async () => {
      const fastFn = async () => {
        await delay(50);
        return 'done';
      };

      const result = await timeout(fastFn, 100);
      expect(result).toBe('done');
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      await Promise.resolve();

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
