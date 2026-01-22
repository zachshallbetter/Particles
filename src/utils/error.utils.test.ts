import { describe, it, expect, vi } from 'vitest';
import {
  isError,
  getErrorMessage,
  createError,
  ErrorCode,
  handleError,
} from './error.utils';

describe('error.utils', () => {
  describe('isError', () => {
    it('should identify Error instances', () => {
      expect(isError(new Error('test'))).toBe(true);
      expect(isError({})).toBe(false);
      expect(isError(null)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error', () => {
      expect(getErrorMessage(new Error('test'))).toBe('test');
    });

    it('should handle string errors', () => {
      expect(getErrorMessage('test')).toBe('test');
    });

    it('should handle unknown errors', () => {
      expect(getErrorMessage({})).toBe('An unknown error occurred');
    });
  });

  describe('createError', () => {
    it('should create error with code', () => {
      const error = createError('Test error', ErrorCode.UNKNOWN);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ErrorCode.UNKNOWN);
    });
  });

  describe('handleError', () => {
    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      handleError(new Error('test'));
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should call custom handler if provided', () => {
      const customHandler = vi.fn();
      handleError(new Error('test'), customHandler);
      expect(customHandler).toHaveBeenCalled();
    });
  });
});
