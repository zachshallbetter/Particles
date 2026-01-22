import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createCleanupManager,
  registerCleanup,
  executeCleanup,
} from './performance-cleanup.utils';

describe('performance-cleanup.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCleanupManager', () => {
    it('should create cleanup manager', () => {
      const manager = createCleanupManager();
      expect(manager).toBeDefined();
      expect(manager.register).toBeDefined();
      expect(manager.cleanup).toBeDefined();
    });
  });

  describe('registerCleanup', () => {
    it('should register cleanup function', () => {
      const cleanup = vi.fn();
      registerCleanup(cleanup);
      executeCleanup();
      expect(cleanup).toHaveBeenCalled();
    });
  });

  describe('executeCleanup', () => {
    it('should execute all registered cleanups', () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();
      registerCleanup(cleanup1);
      registerCleanup(cleanup2);
      executeCleanup();
      expect(cleanup1).toHaveBeenCalled();
      expect(cleanup2).toHaveBeenCalled();
    });
  });
});
