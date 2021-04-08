import React from 'react'
import { renderToString } from 'react-dom/server'
import test from 'ava'
import { Poml } from './poml-react'

const Root: React.FC = ({ children }) => <div>{children}</div>

test('<Poml> Single component', (t) => {
  const result = renderToString(
    <Root>
      <Poml
        source="Hello, <0>World!</0>"
        Components={[({ children }) => <strong>{children}</strong>]}
      />
    </Root>,
  )

  t.is(
    result,
    renderToString(
      <Root>
        Hello, <strong>World!</strong>
      </Root>,
    ),
  )
})

test('<Poml> Multiple Components', (t) => {
  const result = renderToString(
    <Root>
      <Poml
        source="Hello, <0>world!</0> This <1>is</1> <2>cool!</2>"
        Components={[
          ({ children }) => <div id="0">{children}</div>,
          ({ children }) => <div id="1">{children}</div>,
          ({ children }) => <div id="2">{children}</div>,
        ]}
      />
    </Root>,
  )

  t.is(
    result,
    renderToString(
      <Root>
        Hello, <div id="0">world!</div> This <div id="1">is</div> <div id="2">cool!</div>
      </Root>,
    ),
  )
})

test('<Poml> Nested Components', (t) => {
  const result = renderToString(
    <Root>
      <Poml
        source="Hello, <0>world!</0> This <1>is <2>cool!</2></1>"
        Components={[
          ({ children }) => <div id="0">{children}</div>,
          ({ children }) => <div id="1">{children}</div>,
          ({ children }) => <div id="2">{children}</div>,
        ]}
      />
    </Root>,
  )

  t.is(
    result,
    renderToString(
      <Root>
        Hello, <div id="0">world!</div> This{' '}
        <div id="1">
          is <div id="2">cool!</div>
        </div>
      </Root>,
    ).replace(new RegExp('<!-- -->', 'g'), ''),
  )
})
