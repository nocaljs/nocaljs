import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const vendor = new URL('apps/site/vendor/', root)
rmSync(vendor, { recursive: true, force: true })
mkdirSync(new URL('nocaljs/', vendor), { recursive: true })
mkdirSync(new URL('assets/', vendor), { recursive: true })
cpSync(new URL('dist/', root), new URL('nocaljs/', vendor), { recursive: true })
cpSync(new URL('assets/nocal_small.svg', root), new URL('assets/nocal_small.svg', vendor))
const { examples } = await import(new URL('apps/site/src/examples.js', root))
const sources = Object.fromEntries(examples.map(example => [example.id, readFileSync(new URL(example.moduleURL), 'utf8')]))
writeFileSync(new URL('example-sources.js', vendor), `// Generated from the runnable example modules.\nexport const sources = ${JSON.stringify(sources, null, 2)};\n`)
console.log('Assembled website runtime modules and logo from this checkout')
