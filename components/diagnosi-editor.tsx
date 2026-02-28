'use client'

import dynamic from 'next/dynamic'
import type { MDXEditorProps, MDXEditorMethods } from '@mdxeditor/editor'

const Editor = dynamic(() => import('./diagnosi-editor-inner'), { ssr: false })

interface DiagnosiEditorProps extends MDXEditorProps {
  editorRef?: React.RefObject<MDXEditorMethods | null>
}

export function DiagnosiEditor({ editorRef, ...props }: DiagnosiEditorProps) {
  return <Editor editorRef={editorRef} {...props} />
}
