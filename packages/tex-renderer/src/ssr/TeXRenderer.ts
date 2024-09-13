import 'katex/dist/katex.css';

import * as htmlEntities from 'html-entities';
import katex from 'katex';

export class TeXRenderer {
  private static KaTeXOptions: katex.KatexOptions = {
    throwOnError: false,
    strict: false,
    output: 'mathml',
  };

  public static renderAllTexInHTML(html: string): string {
    const processedHtml = html
      // Replace block math $$...$$
      .replace(/\$\$(.*?)\$\$/gs, (_, tex) => {
        return katex.renderToString(htmlEntities.decode(tex), {
          displayMode: true,
          ...TeXRenderer.KaTeXOptions,
        });
      })
      // Replace inline math $...$
      .replace(/\$(.*?)\$/g, (_, tex) => {
        return katex.renderToString(htmlEntities.decode(tex), {
          displayMode: false,
          ...TeXRenderer.KaTeXOptions,
        });
      });

    return processedHtml;
  }
}
