import {useEffect, useState} from 'react';

export function useMarkdownConverter(markdown: string | undefined): {
    loading: boolean;
    html: string | null;
} {
    const [loading, setLoading] = useState(true);
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setHtml(null);
        if (markdown === undefined) {
            return;
        }
        import('@/src/utils/markdownConverter')
            .then(({markdownConverter}) => {
                const html = markdownConverter.makeHtml(markdown);
                setHtml(html);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [markdown]);

    return {loading, html};
}
