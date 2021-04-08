# PoML - Positional Markup Language

```html
This is <0>PoML</0>.
It stands for <0><1>P</1>ositional <1>M</1>arkup <1>L</1>anguage</0>.
Use it to <2>interpolate components or tags</2> into a string and back.
```

**Install**

**React**

For React, just install the `poml-react` module:

```
yarn add poml-react
```

**Core**

For the core package, just install `poml`

```
yarn add poml
```

**Usage**

```typescript
console.log(parsePOML('Hello <0>world!</0>'))
// [
//   { type: 'TextNode', value: 'Hello ' },
//   {
//     type: 'ComponentNode',
//     position: 0,
//     children: [{ type: 'TextNode', value: 'world!' }],
//   },
// ]
```

**React**

```tsx
// prettier-ignore
<Poml
  source="<0>Hello, world!</0> This is<1>cool!</1>"
  Components={[
    ({ children }) => <h1>{children}</h1>,
    ({ children }) => <em>{children}</em>
  ]}
/>
```

- [API](#api)
- [Motivation](#motivation)
- [Specification](#specification)

## API

This module is split up into the core parser logic and individual implementations like React.

### API - Core

#### API - `parsePOML(markup: string): MarkupNode[]`

Parses a POML string returning the AST.

**Returns:** `MarkupNode[]`

```typescript
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
```

_For examples, checkout `src/poml.test.ts`_

### API - React

#### API - `<Poml>`

The `<Poml />` component memoizes and parses of source input and applies your components to the AST. You must supply the `source` PoML string. If your PoML contains Component tags (which it should otherwise its just a regular ol' string), then you should provide an array of components via the `Components` props. The component at index `0` will interpolate into tag `<0>` from the string.

**Example**

```tsx
<Poml
  source="Hello, <0>world!</0> This <1>is <2>cool!</2></1>"
  Components={[
    ({ children }) => <strong>{children} <i class="icon-world" /></div>,
    ({ children }) => <em>{children}</em>,
    ({ children }) => <><span className="strikethrough">{children}</span> great!</>,
  ]}
/>

{/* Result */}

<>
  Hello, <strong>world! <i class="icon-world" /></strong>
  This <em>is <span className="strikethrough">cool!</span> great!
</>
```

_For more examples, checkout `src/poml-react.test.ts`_

## Motivation

String externalization is the process of taking hard-coded strings out of your code and into some other repository (whether that be a CMS or a JSON file). It's typically a pre-requisite of internationalizing a piece of software. A common mistake during this process is known as _string concatenation_.

Suppose you have some HTML that looks like this:

```html
Clone this <span class="icon-text">repository<i class="icon-repo" /></span>
```

When externalizing this string, one might be tempted pull this out into two strings:

- `clone_this: 'Clone this'`
- `repository: 'repository'`

And then recombine them in the template:

```handlebars
{{t "clone_this"}} <span class="icon-text">{{t "repository"}}<i class="icon-repo" /></span>
```

This is effectively concatenating _three strings together!_ First the clone_this string, then a single space, then the repository string. Anybody looking at the two externalized strings in isolation will not fully understand the context. "Clone this". Clone this what? Clone this sheep? Spider? Depending on the context, the translated content may very flip the ordering of the words around. Or maybe in some regions a phrase like "Clone this repository" has been colloquially known as a single word and there you are adding on a bunch of nonsense in their language.

One way to get around this is to directly embed the HTML into your string and pass that along for translation. But what if you need to change the template? Further, we're mixing concerns. Translated text and functional markup.

A better solution is to interpolate your markup into an externalized string.

```
Clone this <0>respository</0>
```

This way, the translator still gets the full context and the actual implemtnation still lives in your source code. Granted, this does create an even larger dependency on the externalized string and the call-site.

## Specification

_NOTE: This section is not yet complete._
