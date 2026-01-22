import { describe, it, expect } from 'vitest';
import { slugify, unslugify } from './slug.utils';

describe('slug.utils', () => {
  describe('slugify', () => {
    it('should convert string to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test String')).toBe('test-string');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Test@String#123')).toBe('teststring123');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle already slugified strings', () => {
      expect(slugify('hello-world')).toBe('hello-world');
    });

    it('should trim whitespace', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });
  });

  describe('unslugify', () => {
    it('should convert slug back to readable string', () => {
      expect(unslugify('hello-world')).toBe('Hello World');
      expect(unslugify('test-string')).toBe('Test String');
    });

    it('should handle multiple hyphens', () => {
      expect(unslugify('hello-world-test')).toBe('Hello World Test');
    });

    it('should handle empty string', () => {
      expect(unslugify('')).toBe('');
    });

    it('should handle single word', () => {
      expect(unslugify('hello')).toBe('Hello');
    });
  });
});
