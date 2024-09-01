import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html';
import {TeX} from 'mathjax-full/js/input/tex';
import {mathjax} from 'mathjax-full/js/mathjax';
import {CHTML} from 'mathjax-full/js/output/chtml';

export class MathJaxConverter {
  private static readonly adapter = liteAdaptor();

  static {
    // Must be called before creating document
    RegisterHTMLHandler(MathJaxConverter.adapter);
  }

  private static readonly converter = mathjax.document('', {
    InputJax: new TeX(),
    OutputJax: new CHTML(),
  });

  public static convert(html: string): string {
    const doc = MathJaxConverter.converter.convert(html);
    return MathJaxConverter.adapter.outerHTML(doc);
  }
}
