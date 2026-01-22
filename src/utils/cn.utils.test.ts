import { describe, it, expect } from 'vitest';
import { cn } from './cn.utils';

describe('cn.utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });

    it('should handle empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('should handle objects', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('should handle mixed inputs', () => {
      expect(cn('foo', ['bar', 'baz'], { qux: true })).toBe('foo bar baz qux');
    });

    it('should deduplicate classes', () => {
      expect(cn('foo', 'bar', 'foo')).toBe('foo bar');
    });
  });
});
