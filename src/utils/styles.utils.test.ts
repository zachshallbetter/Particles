import { describe, it, expect } from 'vitest';
import {
  mergeStyles,
  createStyleObject,
  parseStyles,
  applyStyles,
} from './styles.utils';

describe('styles.utils', () => {
  describe('mergeStyles', () => {
    it('should merge style objects', () => {
      const base = { color: 'red', fontSize: '16px' };
      const override = { color: 'blue' };
      const merged = mergeStyles(base, override);
      expect(merged.color).toBe('blue');
      expect(merged.fontSize).toBe('16px');
    });

    it('should handle empty objects', () => {
      expect(mergeStyles({}, {})).toEqual({});
    });
  });

  describe('createStyleObject', () => {
    it('should create style object from CSS string', () => {
      const styles = createStyleObject('color: red; font-size: 16px;');
      expect(styles.color).toBe('red');
      expect(styles.fontSize).toBe('16px');
    });
  });

  describe('parseStyles', () => {
    it('should parse CSS string to object', () => {
      const styles = parseStyles('color: red; font-size: 16px;');
      expect(styles.color).toBe('red');
      expect(styles.fontSize).toBe('16px');
    });
  });

  describe('applyStyles', () => {
    it('should apply styles to element', () => {
      const element = document.createElement('div');
      applyStyles(element, { color: 'red', fontSize: '16px' });
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
    });
  });
});
