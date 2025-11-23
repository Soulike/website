import {Converter} from 'showdown';

export class MarkdownHtmlConverter {
  private static readonly converter = new Converter({
    parseImgDimensions: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    smoothLivePreview: true,
    literalMidWordUnderscores: true, // avoid conflicting with latex
  });

  public static toHtml(markdown: string) {
    return this.converter.makeHtml(markdown);
  }
}
