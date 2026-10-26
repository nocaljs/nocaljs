# nocaljs-core

## Overview
`nocaljs-core` is the heart of the NocalJS framework. It is a lightweight, dependency-free reactive library that provides fundamental building blocks for modern web applications, including state management, a reactive DOM engine, web component support, and a hash-based router.

## Installation
> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> To use it in your project, you must locally install it by copying the `./dist` folder from the NocalJS repository into your project.

```bash
# Example (once copied to your project)
# npm install ./dist/nocaljs-core
```

## Core Concepts

### State & Reactivity
At the core of NocalJS is the `state` object. A state is a reactive wrapper around a value. When you access a state's `.value` property inside a `watch` or a reactive DOM element, NocalJS automatically tracks it as a dependency. When the `.value` is updated, all dependent functions and DOM elements are re-evaluated.

### DOM Rendering
NocalJS uses a functional approach to DOM creation. The `tags()` function returns a proxy that allows you to create any HTML element as a function. These functions accept an optional properties object and any number of children. Children can be strings, other elements, reactive states, or functions that return elements.

### Watching & Derived State
- **Watch**: The `watch(fn)` function executes a function immediately and re-runs it whenever any reactive state it accessed changes.
- **Derive**: The `derive(fn)` function creates a new reactive state whose value is always the result of the provided function. It automatically updates whenever its dependencies change.

### Components & Routing
- **Components**: NocalJS supports building reusable UI components using standard Web Components. The `component(name, app)` function defines a custom element that renders an app function into its shadow DOM.
- **Routing**: A simple hash-based router is included. It maps hash URL patterns to component functions and handles parameter extraction.

### Data Models
The `model()` function allows you to create deeply reactive objects. It recursively wraps every property of an object in a `state`, making it easy to manage complex application states.

---

## API Reference

### Reactivity API

#### `state(initialValue)`
Creates a new reactive state object.
- **Returns**: A Proxy object with a `.value` property.

#### `states()`
A helper to create multiple states at once using a proxy.
- **Example**: `const { a, b } = states()(0, 1)`

#### `watch(fn)`
Tracks dependencies within `fn` and re-runs it when they change.

#### `derive(fn)`
Creates a state that is automatically kept in sync with the result of `fn`.

#### `change(state)`
- **Returns**: A Promise that resolves with the next value of the state when it changes.

#### `until(state, fn)`
- **Returns**: A Promise that resolves when `fn(state.value)` returns true.

#### `val(state)`
Returns the state's current value. Inside `watch` or `derive`, this read retains normal dependency tracking, including for falsy values.

```javascript
const count = state(0)
watch(() => console.log(val(count)))
count.value++
```

### DOM API

#### `tags(namespace)`
Returns an object with functions for every HTML/SVG tag.
- `namespace`: Optional (e.g., 'http://www.w3.org/2000/svg' for SVG).

#### `add(parent, ...children)`
Appends children to a parent DOM element. Children can be:
- DOM Nodes
- Strings/Numbers
- Reactive States (updates automatically)
- Functions (re-runs automatically on state changes)
- Arrays of the above (flattened)

#### `html(string)`
Converts an HTML string into a DocumentFragment.

### Component API

#### `component(name, app)`
Registers and returns a Web Component constructor.
- `name`: The tag name (e.g., 'my-component').
- `app`: A function `(props, shadow) => ...` that returns the component's content.

### Router API

#### `router(routes, root, notfound)`
Sets up a hash-based router.
- `routes`: Array of `[path, component]` pairs.
- `root`: Optional DOM element to render into (defaults to `document.body`).
- `notfound`: Optional component for unknown routes.

### Data Model API

#### `model(object)`
Recursively wraps an object's properties in `state()`.
- **Returns**: A reactive model where every property is a state.
- **Methods**: `.json()` returns the plain object representation.

### Utilities

#### `sleep(ms)`
Promise-based timeout.

#### `schedule(fn)`
Schedules a function to run in the next microtask.

#### `css`
Tagged template literal for CSS strings.

#### `style(object)`
Converts a style object into a CSS string and caches it.
- **Example**: `style({ color: 'red', 'font-size': '12px' })` -> `"color:red;font-size:12px"`

#### `S(selector, context)`
A reactive wrapper around `querySelectorAll`.
- **Example**: `S('.my-class').css('color', 'red')`

---

## Examples

### Basic Counter
```javascript
import { state, tags, add } from 'nocaljs-core'

const { div, button, p } = tags()
const counter = state(0)

const App = () => div(
  p("Count: ", counter),
  button({ onclick: () => counter.value++ }, "Increment"),
  button({ onclick: () => counter.value-- }, "Decrement")
)

add(document.body, App)
```

### Derived State
```javascript
const count = state(2)
const double = derive(() => count.value * 2)

watch(() => console.log(`Double is: ${double.value}`))
count.value = 5 // Logs: "Double is: 10"
```

### Working with Models
```javascript
const user = model({
  name: "John",
  profile: { age: 30 }
})

watch(() => console.log(user.name.value))
user.name.value = "Jane"
```
