import React from 'react'
import { parsePOML, MarkupNode } from './poml'

export interface PomlProps {
  source: string
  Components: React.ComponentType[]
}

export const Poml: React.FC<PomlProps> = ({ source, Components }) => {
  const result = React.useMemo(() => parsePOML(source), [source])

  return <PomlChildren nodes={result} Components={Components} />
}

interface PomlChildrenProps extends Pick<PomlProps, 'Components'> {
  nodes: MarkupNode[]
}

const PomlChildren: React.FC<PomlChildrenProps> = ({ nodes, Components }) => {
  return (
    <>
      {nodes.map((node) => {
        if (node.type === 'TextNode') {
          return <React.Fragment key={node.id}>{node.value}</React.Fragment>
        }

        const Component = Components[node.position]

        if (!Component) {
          throw new Error('Failed to specify component for position: ' + node.position)
        }

        return (
          <Component key={node.id}>
            <PomlChildren nodes={node.children} Components={Components} />
          </Component>
        )
      })}
    </>
  )
}
