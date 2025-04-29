import * as htmlEntities from 'html-entities';
import type {KatexOptions} from 'katex';
import katex from 'katex';

export class TeXRenderer {
  private static KaTeXOptions: KatexOptions = {
    throwOnError: false,
    strict: false,
    output: 'mathml',
  };

  // $$...$$
  private static readonly BlockMathRegex = /\$\$(.*?)\$\$/gs;
  // $...$
  private static readonly InlineMathRegex = /\$(.*?)\$/g;

  public static renderAllTexInHTML(html: string): string {
    const processedHtml = html
      // Replace block math $$...$$
      .replace(TeXRenderer.BlockMathRegex, (_, tex: string) => {
        return katex.renderToString(htmlEntities.decode(tex), {
          displayMode: true,
          ...TeXRenderer.KaTeXOptions,
        });
      })
      // Replace inline math $...$
      .replace(TeXRenderer.InlineMathRegex, (_, tex: string) => {
        return katex.renderToString(htmlEntities.decode(tex), {
          displayMode: false,
          ...TeXRenderer.KaTeXOptions,
        });
      });

    return processedHtml;
  }
}
