import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const destination = new URL('dist/', root)
const packages = ['nocaljs-core', 'nocaljs-ext', 'nocaljs-ui', 'nocaljs-config', 'nocaljs-cad2d']

// Collect before building the aggregate: only this step cleans the root output.
rmSync(destination, { recursive: true, force: true })
mkdirSync(destination, { recursive: true })
for (const name of packages) {
    const source = new URL(`packages/${name}/dist/`, root)
    const files = readdirSync(source)
    if (!files.some(file => file.endsWith('.mjs'))) throw new Error(`${name} has no built modules`)
    for (const file of files) cpSync(new URL(file, source), new URL(file, destination))
}
console.log(`Collected modules, CSS and generated license notices into ${fileURLToPath(destination)}`)
