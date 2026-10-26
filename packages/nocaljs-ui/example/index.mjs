import * as nocaljs_core  from "/packages/nocaljs-core/dist/nocaljs-core.mjs"
import nocaljs_ui from '../dist/nocaljs-ui.mjs'

const { add, state, tags } = nocaljs_core
const { download, dial } = nocaljs_ui(nocaljs_core)

const { div, h1 } = tags()

const value_1 = state(0)
const value_2 = state(0)

add(document.body, div(
    h1('dial'),
    dial(8, 0, 100, value_1),
    dial(16, 0, 100, value_2),
    download('download', 'application/json', 'data.json', _ => JSON.stringify({ v1: value_1.value, v2: value_2.value}))
))