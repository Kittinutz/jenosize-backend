import { transformTextToKebabCase } from './transform';

describe('transformTextToKebabCase', () => {
  describe('space conversion', () => {
    it('should convert spaces to hyphens', () => {
      expect(transformTextToKebabCase('hello world')).toBe('hello-world');
    });

    it('should convert multiple spaces to multiple hyphens', () => {
      expect(transformTextToKebabCase('hello   world')).toBe('hello---world');
    });

    it('should handle multiple words with spaces', () => {
      expect(transformTextToKebabCase('this is a test')).toBe('this-is-a-test');
    });

    it('should handle leading space', () => {
      expect(transformTextToKebabCase(' hello world')).toBe('-hello-world');
    });

    it('should handle trailing space', () => {
      expect(transformTextToKebabCase('hello world ')).toBe('hello-world-');
    });
  });

  describe('lowercase conversion', () => {
    it('should convert uppercase to lowercase', () => {
      expect(transformTextToKebabCase('HELLO')).toBe('hello');
    });

    it('should convert mixed case to lowercase', () => {
      expect(transformTextToKebabCase('HeLLo WoRLd')).toBe('hello-world');
    });

    it('should convert PascalCase to lowercase with no hyphen', () => {
      expect(transformTextToKebabCase('PascalCase')).toBe('pascalcase');
    });

    it('should convert camelCase to lowercase with no hyphen', () => {
      expect(transformTextToKebabCase('camelCase')).toBe('camelcase');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(transformTextToKebabCase('')).toBe('');
    });

    it('should handle single character', () => {
      expect(transformTextToKebabCase('a')).toBe('a');
    });

    it('should handle single uppercase character', () => {
      expect(transformTextToKebabCase('A')).toBe('a');
    });

    it('should handle string without spaces', () => {
      expect(transformTextToKebabCase('hello')).toBe('hello');
    });

    it('should handle already kebab-case string with spaces', () => {
      expect(transformTextToKebabCase('already-kebab-case')).toBe(
        'already-kebab-case',
      );
    });

    it('should handle numbers in string', () => {
      expect(transformTextToKebabCase('test 123 value')).toBe('test-123-value');
    });

    it('should handle string with only numbers', () => {
      expect(transformTextToKebabCase('123 456')).toBe('123-456');
    });

    it('should preserve existing hyphens', () => {
      expect(transformTextToKebabCase('test-value here')).toBe(
        'test-value-here',
      );
    });
  });

  describe('special characters', () => {
    it('should preserve special characters', () => {
      expect(transformTextToKebabCase('test@value here')).toBe(
        'test@value-here',
      );
    });

    it('should preserve punctuation', () => {
      expect(transformTextToKebabCase('hello! world?')).toBe('hello!-world?');
    });

    it('should preserve underscores', () => {
      expect(transformTextToKebabCase('hello_world test')).toBe(
        'hello_world-test',
      );
    });
  });

  describe('real-world scenarios', () => {
    it('should convert sentence to kebab case', () => {
      expect(transformTextToKebabCase('This Is My Title')).toBe(
        'this-is-my-title',
      );
    });

    it('should handle URL-like strings', () => {
      expect(transformTextToKebabCase('My Page Name')).toBe('my-page-name');
    });

    it('should handle file names', () => {
      expect(transformTextToKebabCase('My Document File')).toBe(
        'my-document-file',
      );
    });
  });
});
