import {Head, Html, Main, NextScript} from 'next/document';

export default function Document() {
    return (
        <Html lang={'zh-CN'}>
            <Head>
                <script
                    defer
                    id='mathjax-cdn'
                    src='https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js'
                />
                <script
                    id={'mathjax-config'}
                    dangerouslySetInnerHTML={{
                        __html: `
MathJax = {
    'tex': {
    'inlineMath': [['$', '$']],
    'displayMath': [['$$', '$$']],
    'processEnvironments': true,
    },
};`,
                    }}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
