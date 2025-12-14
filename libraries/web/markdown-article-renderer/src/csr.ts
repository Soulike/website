export class MarkdownArticleRenderer {
  public static async renderToHtml(markdown: string): Promise<string> {
    // For code split as they are huge packages
    const [{HtmlCodeHighlighter}, {markdownHtmlConverter}, {TeXRenderer}] =
      await Promise.all([
        import('@library/html-code-highlighter/csr'),
        import('@library/markdown-html-converter/csr'),
        import('@library/tex-renderer'),
      ]);
    let html = markdownHtmlConverter.toHtml(markdown);
    html = HtmlCodeHighlighter.highlightAll(html);
    html = TeXRenderer.renderAllTexInHTML(html);
    return html;
  }
}
