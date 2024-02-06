import { unified } from 'unified'

import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkMath from 'remark-math'
import remarkImages from 'remark-images'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkGfm from 'remark-gfm'

import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import rehypeMathjax from 'rehype-mathjax'

import generateTOC from './table-of-contents-generator'
import { scrollingObserver } from './scrolling-observer'
import { handleLocalPath } from './handle-local-path'
import { getGlobalDirPath } from './global-context-manager'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkImages)
  .use(remarkUnwrapImages)
  .use(generateTOC(6))

  .use(remarkRehype)
  .use(rehypeDocument, { title: '' })
  .use(rehypeSlug)
  .use(rehypeSanitize)
  .use(rehypeHighlight)
  .use(rehypeMathjax)
  .use(handleLocalPath, {
    getDirectory: () => getGlobalDirPath(),
  })
  .use(scrollingObserver)
  .use(rehypeFormat)
  .use(rehypeStringify)

export default processor
