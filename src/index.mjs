import * as core from '../packages/nocaljs-core/src/index.mjs'
import * as ext from '../packages/nocaljs-ext/src/index.mjs'
import create_ui from '../packages/nocaljs-ui/src/index.mjs'
import * as cad2d from '../packages/nocaljs-cad2d/src/index.mjs'
import create_cad2dext from '../packages/nocaljs-cad2d/src/ext.mjs'
import create_config from '../packages/nocaljs-config/src/index.mjs'

const ui = create_ui(core)
const cad2dext = create_cad2dext(cad2d, core)
const config = create_config(core)

export default {
    ...core,
    ext,
    ui,
    cad2d: {
        ...cad2d,
        ...cad2dext
    },
    config
}
