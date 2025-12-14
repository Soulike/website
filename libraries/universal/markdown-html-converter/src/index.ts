import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import taskLists from 'markdown-it-task-lists';

export class MarkdownHtmlConverter {
  private static readonly converter = new MarkdownIt({
    html: true,
    linkify: false,
    typographer: false,
  })
    .use(footnote)
    .use(taskLists);

  static {
    // Disable link validation since it blocks inline data: images.
    MarkdownHtmlConverter.converter.validateLink = () => true;
  }

  public static toHtml(markdown: string): string {
    return this.converter.render(markdown);
  }
}
