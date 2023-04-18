export function getFirstSentenceFromMarkdown(markdownText: string): string {
    return markdownText.split('\n')[0];
}
