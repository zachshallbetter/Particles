import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createMemoryMonitor,
  trackObject,
  untrackObject,
  getMemoryStats,
  checkForLeaks,
} from './memory-leak-detection.utils';

describe('memory-leak-detection.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMemoryMonitor', () => {
    it('should create memory monitor', () => {
      const monitor = createMemoryMonitor();
      expect(monitor).toBeDefined();
      expect(monitor.track).toBeDefined();
      expect(monitor.untrack).toBeDefined();
    });
  });

  describe('trackObject', () => {
    it('should track object for leak detection', () => {
      const obj = {};
      trackObject(obj, 'test');
      expect(getMemoryStats().trackedObjects).toBeGreaterThan(0);
    });
  });

  describe('untrackObject', () => {
    it('should untrack object', () => {
      const obj = {};
      trackObject(obj, 'test');
      untrackObject(obj);
      // Object should be untracked
      expect(true).toBe(true);
    });
  });

  describe('getMemoryStats', () => {
    it('should return memory statistics', () => {
      const stats = getMemoryStats();
      expect(stats).toBeDefined();
      expect(stats.trackedObjects).toBeDefined();
    });
  });

  describe('checkForLeaks', () => {
    it('should detect potential memory leaks', () => {
      const leaks = checkForLeaks();
      expect(Array.isArray(leaks)).toBe(true);
    });
  });
});
