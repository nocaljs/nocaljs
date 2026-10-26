# Getting started

NocalJS runs as browser ES modules without a consumer build step. It is not yet published on npm. Download the [v0.1.0 browser archive](https://github.com/nocaljs/nocaljs/releases/download/v0.1.0/nocaljs-0.1.0.zip) and verify it against [SHA256SUMS](https://github.com/nocaljs/nocaljs/releases/download/v0.1.0/SHA256SUMS), or build from source below.

## Build from this checkout

With Node 24.22.1 and npm 11.6.2, run these commands at the monorepo root:

```sh
npm ci
npm run build
mkdir -p examples/counter/vendor
cp dist/nocaljs-core.mjs dist/nocaljs.css examples/counter/vendor/
npm start
```

Open `http://localhost:8080/examples/counter/`. Increment updates the counter; Reset returns it to zero. No CAD module is loaded by this example.

## Use copied distribution files

Create an application directory containing these files:

```text
my-app/
  index.html
  counter.mjs
  vendor/
    nocaljs-core.mjs
    nocaljs.css
```

Copy `index.html` and `counter.mjs` from `examples/counter/`, and copy the two vendor files from the generated `dist/` directory. The release archive already includes this layout under `quickstart/`, ready to serve over HTTP.

Keep the repository's `LICENSE` notice with redistributed framework files. The website's runnable quickstart includes it as `LICENSE.txt`.

Serve `my-app` with an HTTP server, for example `python3 -m http.server 8081 --directory my-app`, and open `http://localhost:8081/`. The browser imports the module by a relative URL, so no bundler or import map is needed. Opening the HTML through `file://` is not the supported procedure.

The counter entry imports only core:

```javascript
import { add, state, tags } from './vendor/nocaljs-core.mjs'

const { button, div, output } = tags()
const count = state(0)

add(document.getElementById('app'), div(
    output({ 'aria-live': 'polite' }, count),
    button({ onclick: () => count.value++ }, 'Increment'),
    button({ onclick: () => count.value = 0 }, 'Reset')
))
```

## Optional modules

Copy only the optional module files your application needs. UI and config are factories which receive the core namespace:

```javascript
import * as core from './vendor/nocaljs-core.mjs'
import createUI from './vendor/nocaljs-ui.mjs'
import createConfig from './vendor/nocaljs-config.mjs'

const ui = createUI(core)
const { config } = createConfig(core)
```

CAD core has named exports; CAD extensions use `createExtensions(cad, core)`. The larger `nocaljs.mjs` aggregate instead has a default export with these modules already initialized. See the [core](nocaljs-core.md), [config](nocaljs-config.md) and [CAD](nocaljs-cad2d.md) reference pages for their APIs.
