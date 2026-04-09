/** Classe applicata all'elemento sorgente PRIMA dell'export (vedi `app/globals.css`). */
export const PDF_EXPORT_ACTIVE_CLASS = 'pdf-export-active'

const MAX_DIM = 32_000
const MAX_AREA = 200_000_000

function computeHtml2CanvasScale(element: HTMLElement): number {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
  let scale = Math.min(3, Math.max(2, dpr * 2))
  const w = Math.max(1, element.scrollWidth)
  const h = Math.max(1, element.scrollHeight)
  const dimCap = Math.min(MAX_DIM / w, MAX_DIM / h)
  const areaCap = Math.sqrt(MAX_AREA / (w * h))
  scale = Math.min(scale, dimCap, areaCap)
  return Math.max(1, Math.round(scale * 100) / 100)
}

const ICON_CLASSES = [
  'status-ok', 'status-warning', 'status-missing',
  'priority-urgent', 'priority-high', 'priority-strategic', 'priority-maintain',
]

/**
 * Avvolge il contenuto delle celle che iniziano con icona status/priority
 * in un div flex per allineamento affidabile nel rendering bitmap.
 * Opera sull'elemento sorgente LIVE (non un clone), ritorna una funzione
 * di cleanup per ripristinare il DOM originale dopo l'export.
 */
function wrapIconCellsForExport(root: HTMLElement): () => void {
  const wrapped: { td: HTMLTableCellElement; wrapper: HTMLDivElement }[] = []

  const cells = root.querySelectorAll<HTMLTableCellElement>('.diagnosi-table tbody td')
  cells.forEach((td) => {
    const first = td.firstElementChild
    if (!first || !ICON_CLASSES.some((c) => first.classList.contains(c))) return

    const wrapper = document.createElement('div')
    wrapper.style.display = 'flex'
    wrapper.style.alignItems = 'center'
    wrapper.style.flexWrap = 'wrap'
    wrapper.style.gap = '0'
    wrapper.setAttribute('data-pdf-icon-wrap', '1')
    while (td.firstChild) wrapper.appendChild(td.firstChild)
    td.appendChild(wrapper)
    wrapped.push({ td, wrapper })
  })

  return () => {
    wrapped.forEach(({ td, wrapper }) => {
      while (wrapper.firstChild) td.appendChild(wrapper.firstChild)
      wrapper.remove()
    })
  }
}

/**
 * Esporta un elemento HTML in PDF con html2pdf.js.
 *
 * La classe `pdf-export-active` e i wrapper flex per le icone vengono
 * applicati all'elemento sorgente PRIMA di html2pdf, cosi sia il plugin
 * pagebreak (che legge computed style) sia html2canvas (che clona il DOM)
 * vedono il layout corretto. Tutto viene ripristinato nel finally.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default

  const sourceWidth = Math.round(element.getBoundingClientRect().width)

  element.classList.add(PDF_EXPORT_ACTIVE_CLASS)
  const unwrapIcons = wrapIconCellsForExport(element)

  try {
    const scale = computeHtml2CanvasScale(element)

    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename,
      image: { type: 'png' as const },
      pagebreak: { mode: ['css', 'legacy'] as const },
      html2canvas: {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
          if (sourceWidth > 0) {
            clonedElement.style.width = `${sourceWidth}px`
            clonedElement.style.maxWidth = `${sourceWidth}px`
          }
        },
      },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' as const },
    }

    await html2pdf().set(options as never).from(element).save()
  } finally {
    unwrapIcons()
    element.classList.remove(PDF_EXPORT_ACTIVE_CLASS)
  }
}
