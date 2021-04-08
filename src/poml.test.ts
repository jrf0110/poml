import test from 'ava'
import { ComponentNode, MarkupNode, parsePOML, TextNode } from './poml'

const mockId = 'mock_id'

function replaceIdsWithMocks(nodes: MarkupNode[]): MarkupNode[] {
  return nodes.map((node) => {
    if (node.type === 'TextNode') {
      if (typeof node.id !== 'string') {
        throw new Error('For some reaosn, node.id is not a string')
      }

      return { ...node, id: mockId }
    }

    return { ...node, id: mockId, children: replaceIdsWithMocks(node.children) }
  })
}

type ComponentNodeWithoutId = Omit<ComponentNode, 'id' | 'children'> & {
  children: NodeWithoutIds[]
}
type NodeWithoutIds = Omit<TextNode, 'id'> | ComponentNodeWithoutId

function fillInMissingIdsWithMocks(nodes: NodeWithoutIds[]): MarkupNode[] {
  return nodes.map((node) => {
    if (node.type === 'ComponentNode') {
      return {
        ...node,
        id: mockId,
        children: fillInMissingIdsWithMocks(node.children as any),
      }
    }

    return { ...node, id: mockId } as any
  })
}

test('Single component', (t) => {
  const result = replaceIdsWithMocks(parsePOML('Hello <0>world!</0>'))

  t.deepEqual(
    result,
    fillInMissingIdsWithMocks([
      { type: 'TextNode', value: 'Hello ' },
      {
        type: 'ComponentNode',
        position: 0,
        children: [{ type: 'TextNode', value: 'world!' }],
      },
    ]),
  )
})

test('Multiple components', (t) => {
  const result = replaceIdsWithMocks(parsePOML('Hello <0>world!</0> This <1>is</1> <2>cool!</2>'))

  t.deepEqual(
    result,
    fillInMissingIdsWithMocks([
      { type: 'TextNode', value: 'Hello ' },
      {
        type: 'ComponentNode',
        position: 0,
        children: [{ type: 'TextNode', value: 'world!' }],
      },
      { type: 'TextNode', value: ' This ' },
      {
        type: 'ComponentNode',
        position: 1,
        children: [{ type: 'TextNode', value: 'is' }],
      },
      { type: 'TextNode', value: ' ' },
      {
        type: 'ComponentNode',
        position: 2,
        children: [{ type: 'TextNode', value: 'cool!' }],
      },
    ]),
  )
})

test('Nested components', (t) => {
  const result = replaceIdsWithMocks(parsePOML('Hello <0>world!</0> This <1>is <2>cool!</2></1>'))

  t.deepEqual(
    result,
    fillInMissingIdsWithMocks([
      { type: 'TextNode', value: 'Hello ' },
      {
        type: 'ComponentNode',
        position: 0,
        children: [{ type: 'TextNode', value: 'world!' }],
      },
      { type: 'TextNode', value: ' This ' },
      {
        type: 'ComponentNode',
        position: 1,
        children: [
          { type: 'TextNode', value: 'is ' },
          {
            type: 'ComponentNode',
            position: 2,
            children: [{ type: 'TextNode', value: 'cool!' }],
          },
        ],
      },
    ]),
  )
})

test('Super nested components', (t) => {
  const result = replaceIdsWithMocks(
    parsePOML('Hello <0>w<1>o<2>r<3>l</3>d!</2></1></0> This <1>is <2>cool!</2></1>'),
  )

  t.deepEqual(
    result,
    fillInMissingIdsWithMocks([
      { type: 'TextNode', value: 'Hello ' },
      {
        type: 'ComponentNode',
        position: 0,
        children: [
          { type: 'TextNode', value: 'w' },
          {
            type: 'ComponentNode',
            position: 1,
            children: [
              { type: 'TextNode', value: 'o' },
              {
                type: 'ComponentNode',
                position: 2,
                children: [
                  { type: 'TextNode', value: 'r' },
                  {
                    type: 'ComponentNode',
                    position: 3,
                    children: [{ type: 'TextNode', value: 'l' }],
                  },
                  { type: 'TextNode', value: 'd!' },
                ],
              },
            ],
          },
        ],
      },
      { type: 'TextNode', value: ' This ' },
      {
        type: 'ComponentNode',
        position: 1,
        children: [
          { type: 'TextNode', value: 'is ' },
          {
            type: 'ComponentNode',
            position: 2,
            children: [{ type: 'TextNode', value: 'cool!' }],
          },
        ],
      },
    ]),
  )
})

test('Invalid syntax throws missing closing tag', (t) => {
  t.throws(() => parsePOML('Hello <0>world! This <1>is <2>cool!</2></1>'))
})
