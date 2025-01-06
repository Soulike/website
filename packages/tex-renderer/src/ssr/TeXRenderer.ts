import 'katex/dist/katex.css';

import type {KatexOptions} from 'katex';

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

  public static async renderAllTexInHTML(html: string): Promise<string> {
    const [htmlEntities, katex] = await Promise.all([
      import('html-entities'),
      import('katex'),
    ]);

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
