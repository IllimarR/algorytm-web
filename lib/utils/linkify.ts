const URL_RE = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,!?)]/g;
const A_TAG_RE = /(<a\b[^>]*>[\s\S]*?<\/a>)/gi;
// Paragraphs (or bare text lines) that consist of 5+ dashes are used as
// visual separators in the podcast shownotes — replace with an <hr>.
const DASH_DIVIDER_RE = /<p[^>]*>\s*-{5,}\s*<\/p>/gi;
// Captivate encodes blank lines from the editor as <p><br></p>. Strip those
// plus any other empty/whitespace-only paragraphs so spacing comes from the
// stylesheet, not the content.
const EMPTY_P_RE = /<p[^>]*>\s*(?:<br\s*\/?>\s*|&nbsp;|&#160;|\u00a0)*\s*<\/p>/gi;

/**
 * Wraps bare http(s) URLs in HTML with <a> tags, while leaving existing
 * anchor tags untouched. Expects trusted HTML — does not sanitize.
 */
export function linkifyHtml(html: string): string {
  return html
    .split(A_TAG_RE)
    .map((part, index) => {
      // Odd indices are the captured <a>...</a> blocks — preserve as-is.
      if (index % 2 === 1) return part;
      return part.replace(
        URL_RE,
        (url) =>
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
      );
    })
    .join('');
}

/**
 * Prepares Captivate shownotes HTML for display: linkifies bare URLs and
 * swaps "-----" separator paragraphs for a decorative <hr>.
 */
export function prepareShownotes(html: string): string {
  const cleaned = html
    .replace(DASH_DIVIDER_RE, '<hr />')
    .replace(EMPTY_P_RE, '');
  return linkifyHtml(cleaned);
}
