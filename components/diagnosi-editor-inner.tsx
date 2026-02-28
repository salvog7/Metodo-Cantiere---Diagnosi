'use client'

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  type MDXEditorProps,
  type MDXEditorMethods,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

const PLUGINS = [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  thematicBreakPlugin(),
  markdownShortcutPlugin(),
]

interface DiagnosiEditorInnerProps extends MDXEditorProps {
  editorRef?: React.RefObject<MDXEditorMethods | null>
}

export default function DiagnosiEditorInner({
  editorRef,
  markdown,
  ...props
}: DiagnosiEditorInnerProps) {
  return <MDXEditor ref={editorRef} plugins={PLUGINS} markdown={markdown ?? ''} {...props} />
}
