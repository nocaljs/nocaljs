# NocalJS Config

NocalJS is a parameter panel build on top of [nocaljs](https://github.com/nocaljs/nocaljs).

It is similar to [dat.gui](https://github.com/dataarts/dat.gui), but simpler.
 
It supports the following UI elements:
  * bool
  * range
  * separator
  * color
  * text
  * choice
  * separator

Here's an example:

```javascript
import * as core from '../../../dist/nocaljs-core.mjs'
import createConfig from '../../../dist/nocaljs-config.mjs'

const { add, tags } = core
const { config } = createConfig(core)

const { div, h1, span } = tags()

const params = config(  span({style: 'font-weight:bold'}, 'Settings'), { position: 'top-right', open: false} )
const { temperature } = params({
        type: 'range',
        label: 'Temperature:',
        default: 50,
        min: 0,
        max: 100,
        step: 1
    })
add(document.body, params.dom())
```

Now `temperature` is a nocaljs state variable that you can use in your app.

```javascript
add(document.body, () => div(
    h1('Temperature'),
    span(`Outside: ${temperature.value} degrees`)
    )
)
```

It is best to look at the example code ([./example/configexample.js](./example/configexample.js))

From the repository root, run `npm ci`, `npm run build`, then `npm start`. Open `/packages/nocaljs-config/example/`. The standalone module exports a factory; the aggregate's `config` namespace is already initialized.
