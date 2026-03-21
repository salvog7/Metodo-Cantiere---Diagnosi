import DOMPurify from 'dompurify'
import { isLikelyHtmlFragment, markdownToHtml } from './diagnosi-content'

export function sanitizeDiagnosiHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['section', 'footer'],
    ADD_ATTR: ['target', 'rel', 'class'],
  }) as string
}

/** Display: legacy Markdown → HTML, HTML → sanitized HTML. */
export function contentToSafeHtml(content: string): string {
  const raw = content.trim()
  if (!raw) return ''
  const html = isLikelyHtmlFragment(content) ? content : markdownToHtml(content)
  return sanitizeDiagnosiHtml(html)
}
