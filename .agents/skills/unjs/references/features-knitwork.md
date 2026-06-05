---
name: knitwork-x
description: Utilities to generate safe JavaScript and TypeScript code (comprehensive fork of knitwork)
---

# Knitwork-X

Knitwork-X provides utilities for generating safe JavaScript and TypeScript code programmatically. Forked from [unjs/knitwork](https://github.com/unjs/knitwork), it adds comprehensive TypeScript code-generation APIs (classes, control flow, types, decorators, etc.). Use for codegen tools, build-time transformations, and plugin output.

**Package:** `knitwork-x` · **Source:** https://github.com/hairyf/knitwork-x

## Usage

### ESM

```typescript
import {
  genDefaultExport,
  genDynamicImport,
  genExport,
  genImport,
  genTypeExport,
} from 'knitwork-x'

genDefaultExport("foo")
// ~> `export default foo;`

genExport("pkg", ["a", "b"])
// ~> `export { a, b } from "pkg";`

genExport("pkg", "*")
// ~> `export * from "pkg";`

genExport("pkg", { name: "*", as: "bar" })
// ~> `export * as bar from "pkg";`

genImport("pkg", "foo")
// ~> `import foo from "pkg";`

genImport("pkg", ["a", "b"])
// ~> `import { a, b } from "pkg";`

genImport("@nuxt/utils", ["test"], { type: true })
// ~> `import type { test } from "@nuxt/utils";`

genDynamicImport("pkg")
// ~> `import("pkg")`

genDynamicImport("pkg", { wrapper: true })
// ~> `() => import("pkg")`

genDynamicImport("pkg", { type: true, name: "foo" })
// ~> `typeof import("pkg").foo`

genTypeExport("@nuxt/utils", ["test"])
// ~> `export type { test } from "@nuxt/utils";`
```

### Serialization

```typescript
import { genArray, genMap, genObject, genSet } from 'knitwork-x'

genArray([1, 2, 3])
// ~> `[1, 2, 3]`

genObject({ foo: "bar", test: '() => import("pkg")' })
// ~> `{ foo: bar, test: () => import("pkg") }`

genMap([["foo", "bar"], ["baz", 1]])
// ~> `new Map([["foo", "bar"], ["baz", 1]])`

genSet(["foo", "bar", 1])
// ~> `new Set(["foo", "bar", 1])`
```

### String

```typescript
import { escapeString, genString, genTemplateLiteral, genVariableName } from 'knitwork-x'

genString("foo")
// ~> `"foo"`

genVariableName("for")
// ~> `_for`

escapeString("foo'bar")
// ~> `foo\'bar`

genTemplateLiteral(["hello ", "x"])
// ~> `hello ${x}`
```

### TypeScript — Functions, types, control flow

```typescript
import {
  genArrowFunction,
  genFunction,
  genInterface,
  genTypeAlias,
  genVariable,
  genBlock,
  genIf,
  genReturn,
  genAugmentation,
  genInlineTypeImport,
} from 'knitwork-x'

genFunction({ name: "foo", parameters: [{ name: "x", type: "string" }] })
// ~> `function foo(x: string) {}`

genArrowFunction({ parameters: [{ name: "x", type: "number" }], body: "x * 2" })
// ~> `(x: number) => x * 2`

genInterface("FooInterface", { name: "string", count: "number" })
// ~> `interface FooInterface { name: string, count: number }`

genTypeAlias("Foo", "string")
// ~> `type Foo = string`

genVariable("a", "2")
// ~> `const a = 2`

genBlock(["const a = 1;", "return a;"])
// ~> `{ const a = 1; return a; }`

genAugmentation("@nuxt/utils", "interface MyInterface {}")
// ~> `declare module "@nuxt/utils" { interface MyInterface {} }`

genInlineTypeImport("@nuxt/utils", "genString")
// ~> `typeof import("@nuxt/utils").genString`
```

### TypeScript — Classes, enums, switch, try/catch

```typescript
import {
  genClass,
  genConstructor,
  genMethod,
  genGetter,
  genSetter,
  genEnum,
  genConstEnum,
  genSwitch,
  genCase,
  genDefault,
  genTry,
  genCatch,
  genFinally,
} from 'knitwork-x'

genClass("Bar", [genConstructor([], ["super();"])])
// ~> `class Bar { constructor() { super(); } }`

genClass("Baz", [], { extends: "Base", implements: ["I1", "I2"] })
// ~> `class Baz extends Base implements I1, I2 {}`

genEnum("Color", { Red: 0, Green: 1, Blue: 2 })
// ~> `enum Color { Red = 0, Green = 1, Blue = 2 }`

genSwitch("x", [genCase("1", "break;"), genDefault("return 0;")])
// ~> `switch (x) { case 1: break; default: return 0; }`
```

### TypeScript — Type-level

```typescript
import {
  genUnion,
  genIntersection,
  genConditionalType,
  genMappedType,
  genKeyOf,
  genTemplateLiteralType,
  genTypeObject,
  genSatisfies,
  genTypeAssertion,
} from 'knitwork-x'

genUnion(["string", "number"])
// ~> `string | number`

genConditionalType("T", "null", "never", "T")
// ~> `T extends null ? never : T`

genMappedType("K", "keyof T", "U")
// ~> `{ [K in keyof T]: U }`

genTemplateLiteralType(["Hello ", "T", ""])
// ~> `` `Hello ${T}` ``

genSatisfies("config", "ConfigType")
// ~> `config satisfies ConfigType`
```

### Utils

```typescript
import { genComment, genJSDocComment, genKey, genLiteral, genRegExp } from 'knitwork-x'

genComment("Single line comment")
// ~> `// Single line comment`

genJSDocComment({ description: "Fn", param: { x: "number" }, returns: "void" })
// ~> JSDoc block with @param and @returns

genKey("foo-bar")
// ~> `"foo-bar"`

genLiteral(['type', ['type', 'A'], ['...', 'b']])
// ~> `{ type, type: A, ...b }`

genRegExp("foo", "gi")
// ~> `/foo/gi`
```

## Key Points

- **Package:** Use `knitwork-x` (not `knitwork`) for the extended API.
- **ESM:** `genImport` / `genExport`; type imports via `genImport(..., { type: true })`; re-export all with `genExport("pkg", "*")`.
- **Safe names:** `genVariableName(name)` for identifiers; `genKey(key)` for object keys (quotes when needed).
- **TypeScript:** Covers functions, classes, enums, control flow (if/switch/for/try), type aliases, interfaces, conditional/mapped types, `declare module`, and JSDoc.
- **Serialization:** `genArray`, `genObject`, `genMap`, `genSet` for runtime values; `genTypeObject` for type shapes.

<!--
Source references:
- https://github.com/hairyf/knitwork-x
- https://github.com/hairyf/knitwork-x/blob/main/README.md
-->
