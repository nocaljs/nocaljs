import webpack from 'webpack'
import config from '../webpack.config.js'
import { mkdirSync, writeFileSync } from 'node:fs'

// Keep raw build paths private; release notices use only package identities.
webpack(config, (error, stats) => {
    if (error) throw error
    console.log(stats.toString({ colors: false, modules: false }))
    if (stats.hasErrors()) { process.exitCode = 1; return }
    mkdirSync(new URL('../build/', import.meta.url), { recursive: true })
    writeFileSync(new URL('../build/aggregate-stats.json', import.meta.url), JSON.stringify(stats.toJson({ all: false, modules: true, nestedModules: true })))
})
