import {htmlSanitizer} from '@library/html-sanitizer/ssr';
import {describe, expect, it} from 'bun:test';

import {MarkdownHtmlConverter} from './markdown-html-converter.js';

const markdownHtmlConverter = new MarkdownHtmlConverter(htmlSanitizer);

describe('MarkdownHtmlConverter', () => {
  describe('task lists', () => {
    it('should convert unchecked task items', () => {
      const markdown = '- [ ] Unchecked task';
      const html = markdownHtmlConverter.toHtml(markdown);

      expect(html).toContain('<input');
      expect(html).toContain('type="checkbox"');
      expect(html).not.toMatch(/checked=""/);
    });

    it('should convert checked task items', () => {
      const markdown = '- [x] Checked task';
      const html = markdownHtmlConverter.toHtml(markdown);

      expect(html).toContain('<input');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('checked');
    });
  });

  describe('footnotes', () => {
    it('should convert footnotes', () => {
      const markdown = `Text with footnote.[^1]

[^1]: This is the footnote content.`;
      const html = markdownHtmlConverter.toHtml(markdown);

      expect(html).toContain('class="footnote-ref"');
      expect(html).toContain('class="footnotes"');
      expect(html).toContain('This is the footnote content.');
    });

    it('should convert inline footnotes', () => {
      const markdown = 'Text with inline footnote.^[Inline footnote content.]';
      const html = markdownHtmlConverter.toHtml(markdown);

      expect(html).toContain('Inline footnote content.');
    });
  });

  describe('data URIs', () => {
    it('should allow inline data URI images', () => {
      const markdown = '![alt](data:image/png;base64,iVBORw0KGgo=)';
      const html = markdownHtmlConverter.toHtml(markdown);

      expect(html).toContain(
        '<img src="data:image/png;base64,iVBORw0KGgo=" alt="alt">',
      );
    });

    it('should allow reference-style data URI images', () => {
      const markdown = `![init][init]

[init]: data:image/svg+xml;base64,PD94bWw=`;
      const html = markdownHtmlConverter.toHtml(markdown);

      expect(html).toContain(
        '<img src="data:image/svg+xml;base64,PD94bWw=" alt="init">',
      );
    });
  });

  describe('underscores in text', () => {
    it('should not convert underscores in the middle of words', () => {
      const markdown = 'some_variable_name';
      const html = markdownHtmlConverter.toHtml(markdown);

      expect(html).toContain('some_variable_name');
      expect(html).not.toContain('<em>');
    });
  });
});
