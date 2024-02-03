import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { 
        indentWithTab,
        defaultKeymap, historyKeymap,
        history
      } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'

import placeholders from './placeholder-decoration'
import { getTreeData } from './scrolling-observer'
import { computedPosition, getEditorElementList, getViewerElementList } from './compute-position'

declare let editorView: EditorView

const theme = EditorView.theme({
  'span.cm-header-1, span.cm-formatting-header-1': {
    color: 'white',
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "lightyellow",
  },
})


let scrollElementIndex: number

type MarkdownProcessor = (markdown: string) => string

export const run = (editorSelector: string,
                    viewerSelector: string,
                    viewerContainerSelector: string,
                    markdownProcessor: MarkdownProcessor
                  ) => {
  const doc = ''
  
  const editor = document.querySelector(editorSelector) as HTMLDivElement
  const viewer = document.querySelector(viewerSelector) as HTMLDivElement
  const viewerContainer = document.querySelector(viewerContainerSelector) as HTMLDivElement
  
  let updateListener = EditorView.updateListener.of(source => {
    if (source.docChanged) {
      viewer.innerHTML = markdownProcessor(source.state.doc.toString())
    }
  })


  editorView = new EditorView({
    doc,
    extensions: [
      placeholders,
      basicSetup,
      history(),
      markdown({
        base: markdownLanguage,
			  codeLanguages: languages,
        extensions: [

        ],
      }),

      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),

      EditorView.domEventHandlers({
        scroll(event, view) {
          const self = editor

          if (!self.matches(':hover')) return

          const scrollTop = (event?.target as HTMLElement).scrollTop

          computedPosition(view, viewer, getTreeData())

          getEditorElementList().forEach((value, index) => {
            if (scrollTop < value) {
              scrollElementIndex = index - 1
              return false
            }
          })

          if (scrollElementIndex > 0) {
            viewerContainer.scrollTop = getViewerElementList()[scrollElementIndex]
          }

        }
      }),

      syntaxHighlighting(defaultHighlightStyle),
      theme,
      EditorView.lineWrapping,
      updateListener,
    ],
    parent: editor as HTMLDivElement,
  })

  editorView.focus()
}

export const upload = (content: string) => {
  editorView.dispatch({
    changes: {
      from: 0,
      to: editorView.state.doc.length,
      insert: content
    }
  })
}

export const download = () => editorView.state.doc.toString()
