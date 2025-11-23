export class MarkdownArticleRenderer {
  public static async renderToHtml(markdown: string): Promise<string> {
    // For code split as they are huge packages
    const [{HtmlCodeHighlighter}, {MarkdownHtmlConverter}, {TeXRenderer}] =
      await Promise.all([
        import('@library/html-code-highlighter/csr'),
        import('@library/markdown-html-converter'),
        import('@library/tex-renderer'),
      ]);
    let html = MarkdownHtmlConverter.toHtml(markdown);
    html = HtmlCodeHighlighter.highlightAll(html);
    html = TeXRenderer.renderAllTexInHTML(html);
    return html;
  }
}
