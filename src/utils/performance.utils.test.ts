import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  measurePerformance,
  createPerformanceMonitor,
  getFPS,
  throttleByFPS,
} from './performance.utils';

describe('performance.utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('measurePerformance', () => {
    it('should measure function execution time', async () => {
      const fn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      };
      const result = await measurePerformance(fn);
      expect(result.duration).toBeGreaterThan(0);
    });
  });

  describe('createPerformanceMonitor', () => {
    it('should create performance monitor', () => {
      const monitor = createPerformanceMonitor();
      expect(monitor).toBeDefined();
      expect(monitor.start).toBeDefined();
      expect(monitor.end).toBeDefined();
    });

    it('should track performance metrics', () => {
      const monitor = createPerformanceMonitor();
      monitor.start('test');
      monitor.end('test');
      const metrics = monitor.getMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('getFPS', () => {
    it('should calculate FPS', () => {
      const fps = getFPS();
      expect(fps).toBeGreaterThanOrEqual(0);
    });
  });

  describe('throttleByFPS', () => {
    it('should throttle function by FPS', () => {
      const fn = vi.fn();
      const throttled = throttleByFPS(fn, 60);

      throttled();
      expect(fn).toHaveBeenCalled();
    });
  });
});
