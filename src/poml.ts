import { v4 as uuid } from 'uuid'

export type TextNode = {
  type: 'TextNode'
  id: string
  value: string
}

export type ComponentNode = {
  type: 'ComponentNode'
  id: string
  position: number
  children: MarkupNode[]
}

export type MarkupNode = TextNode | ComponentNode

const lexicon = {
  openTag: /<\d+>/,
  closeTag: /<\/\d+>/,
  all: /<\d+>|<\/\d+>/g,
}

export function parsePOML(markup: string): MarkupNode[] {
  const nodes: MarkupNode[] = []
  let childrenStack = [nodes]
  let currentComponentNode: ComponentNode | null = null
  let currentStr = ''
  let currentStrI = 0

  for (let { 0: match, index: matchI } of markup.matchAll(lexicon.all)) {
    // This should never really be the case
    if (matchI === undefined) {
      throw new Error('Match index undefined')
    }

    const children = last(childrenStack)

    if (matchI > currentStrI) {
      currentStr = markup.substring(currentStrI, matchI)

      // TODO: We shouldn't _have_ to ensure that the currentStr isn't a match
      if (currentStr && !lexicon.all.test(currentStr)) {
        children.push({
          type: 'TextNode',
          id: uuid(),
          value: currentStr,
        })
      }

      currentStrI = matchI + match.length
    }

    if (lexicon.closeTag.test(match)) {
      if (!currentComponentNode) {
        throw new Error('Found closing')
      }

      childrenStack.pop()
    } else if (lexicon.openTag.test(match)) {
      currentComponentNode = {
        type: 'ComponentNode',
        id: uuid(),
        position: getPositionFromOpenTag(match),
        children: [],
      }

      children.push(currentComponentNode)
      childrenStack.push(currentComponentNode.children)
    } else {
      throw new Error(`Unexpected match '${match}' at index: ${matchI}`)
    }
  }

  if (last(childrenStack) !== nodes) {
    throw new Error('Missing closing tag somewhere. One day this error will get better')
  }

  return nodes
}

function last<T>(list: T[]): T {
  return list[list.length - 1]
}

export function getPositionFromOpenTag(tag: string) {
  if (!lexicon.openTag.test(tag)) {
    throw new Error('Invalid open tag: ' + tag)
  }

  return parseInt(tag.substring(1, tag.length - 1))
}

type ParseFn = typeof parsePOML
