# nocaljs - A minimal reactive framework, some batteries included

**nocaljs** is a lightweight, functional framework for building reactive web applications.

## Features

- Zero build step
- Reactive state management
- Declarative DOM creation and updates
- Utilities like `sleep`, `schedule`, `S()` selector, and more

## Example of a counter

``` javascript
import { state, tags, add } from 'nocaljs'

const { button, div, p } = tags()

const counter = state(0)

const App = () => div(
        p("Counter: ", counter),
        button({ onclick: () => counter.value++ }, "Increment"),
        button({ onclick: () => counter.value-- }, "Decrement"),
        button({ onclick: () => counter.value = 0 }, "Reset")
    )

add(document.body, App())
```

## Functions

```javascript
import { tags, add, html, state, states, watch, derive, change, until, sleep, schedule, css, S, router, model, component, style } from 'nocaljs.mjs'

```

### State

- **state** – Creates a single reactive state value.
- **states** – Creates multiple reactive state values as a grouped object.
- **model** – Creates a reactive data model with two-way binding support.
- **watch** – Runs a function whenever any of its dependent states change.
- **derive** – Creates a read-only derived state based on other states.
- **change** – Returns a promise that resolves on state change.
- **until** – Returns a promise that resolves when a condition becomes true.

### DOM

- **tags** – Creates DOM tag functions (e.g., `div()`, `span()`) optionally with namespace support.
- **add** – Appends a new element to the DOM; a shorthand for creating and adding.
- **html** – Inserts raw HTML content into an element.
- **S** – A selector function, like `$` from jQuery.
- **component** – Defines a reusable, reactive UI component.

### Routing

- **router** – Handles hash-based routing and view switching.
 
### Utilities

- **sleep** – Pauses execution for a given number of milliseconds.
- **schedule** – Runs a function on the next microtask.
- **css** – Tagged template literal for CSS syntax highlighting in IDE.
- **style** – Applies scoped inline styles or generated CSS to components.


## Documentation

Documentation is a work in progress...

  * [nocaljs documentation](https://nocaljs.github.io/docs/)