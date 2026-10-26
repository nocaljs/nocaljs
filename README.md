# NocalJs - A zero calories reactive framework

![NocalJS - Zero calories JS Reactive Framework](./assets/nocal_small.svg) 

**NocalJs** is a lightweight, functional framework for building reactive web applications.

## Features

- Zero build step
- Reactive state management
- Declarative DOM creation and updates
- Utilities like `sleep`, `schedule`, `S()` selector, and more

## Installation

> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> Download the [v0.1.0 browser archive](https://github.com/nocaljs/nocaljs/releases/download/v0.1.0/nocaljs-0.1.0.zip), verify it against [SHA256SUMS](https://github.com/nocaljs/nocaljs/releases/download/v0.1.0/SHA256SUMS), and serve its `quickstart/` directory over HTTP. No npm install or bundler is needed. You can also build the modules from this checkout as described below.

Maintainers need Node **24.22.1** (`nvm use`) and npm **11.6.2**. From the repository root:

```sh
npm ci
npm run build
mkdir -p examples/counter/vendor
cp dist/nocaljs-core.mjs dist/nocaljs.css examples/counter/vendor/
npm start
```

Open [the counter](http://localhost:8080/examples/counter/) and click Increment. It loads only the small core. The example consists of [index.html](examples/counter/index.html) and [counter.mjs](examples/counter/counter.mjs); copy those two files plus the core module and CSS into your own directory to use it without a bundler or transpiler. Serve it over HTTP, because browser modules require a server.

`npm run build` also generates optional modules and assembles the website's runtime assets. It does not deploy anything.

Keep the MIT `LICENSE` notice with redistributed framework files.

Versioned browser release preparation, checksums and deployment instructions are in [RELEASING.md](RELEASING.md). Optional CAD and aggregate distributions also require the generated third-party notices. See [MIGRATION.md](MIGRATION.md) for existing CDN and standalone config consumers, and [CONTRIBUTING.md](CONTRIBUTING.md) to contribute.

## Example of a counter

``` javascript
import { state, tags, add } from './vendor/nocaljs-core.mjs'

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
import { tags, add, html, state, states, watch, derive, change, until, val, sleep, schedule, css, S, router, model, component, style } from './vendor/nocaljs-core.mjs'

```

### State

- **state** – Creates a single reactive state value.
- **states** – Creates multiple reactive state values as a grouped object.
- **model** – Creates a reactive data model with two-way binding support.
- **watch** – Runs a function whenever any of its dependent states change.
- **derive** – Creates a read-only derived state based on other states.
- **change** – Returns a promise that resolves on state change.
- **until** – Returns a promise that resolves when a condition becomes true.
- **val** – Reads a state's current value, retaining dependency tracking.

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

The Markdown reference is in [packages/nocaljs-docs/docs](packages/nocaljs-docs/docs/index.md). The website source is in [apps/site](apps/site/README.md). Build and preview the complete website/reference with `npm run site:build` and `npm run site:preview`, then open `http://localhost:8080/`.

For optional modules, keep their browser files beside the core and initialize factories explicitly:

```javascript
import * as core from './vendor/nocaljs-core.mjs'
import createUI from './vendor/nocaljs-ui.mjs'
import createConfig from './vendor/nocaljs-config.mjs'

const ui = createUI(core)
const { config } = createConfig(core)
```

`nocaljs.mjs` remains the larger default-export aggregate with initialized `ui`, `config`, `ext` and `cad2d` modules. Resolver-based consumers of a local checkout can use `nocaljs` or `nocaljs/core` for core, and `nocaljs/all` for that aggregate. Bare package names require a resolver or an explicit import map; browser examples use file URLs.

## Contributor checks

Use Python 3.11 for the documentation toolchain. Install its locked dependencies in a virtual environment, then run the complete local gate:

```sh
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r packages/nocaljs-docs/requirements.txt
npm run check
```

This runs ESLint, source tests, all package/aggregate builds, strict MkDocs generation, combined static site assembly, and isolated artifact/site consumer tests. The root `package-lock.json` is the only npm lockfile; run installs from the root. Source tests can run independently with `npm test`; artifact/site tests require `npm run site:build` first.

ESLint checks maintained library source, build scripts, tests, the website and the counter example. Historical autodocs and standalone prototype scripts are outside that maintained scope. Existing unused variables are tolerated; undefined references, invalid syntax and the other recommended correctness rules are checked. CI runs the same gate without publishing.

```
   )(
  ('')
   \/
   ^^
```
