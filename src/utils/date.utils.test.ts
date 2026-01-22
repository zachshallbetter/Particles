import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  formatDuration,
  parseDate,
  isValidDate,
} from './date.utils';

describe('date.utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBeTruthy();
    });

    it('should handle different formats', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 60000); // 1 minute ago
      expect(formatRelativeTime(past)).toContain('minute');
    });

    it('should handle future dates', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 60000); // 1 minute from now
      expect(formatRelativeTime(future)).toContain('minute');
    });
  });

  describe('formatDuration', () => {
    it('should format duration in milliseconds', () => {
      expect(formatDuration(1000)).toBe('1s');
      expect(formatDuration(60000)).toBe('1m');
      expect(formatDuration(3600000)).toBe('1h');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0s');
    });
  });

  describe('parseDate', () => {
    it('should parse date string', () => {
      const date = parseDate('2024-01-15');
      expect(date).toBeInstanceOf(Date);
    });

    it('should handle invalid date strings', () => {
      expect(() => parseDate('invalid')).toThrow();
    });
  });

  describe('isValidDate', () => {
    it('should validate date objects', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });
});
