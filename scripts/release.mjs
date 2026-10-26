import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { releaseNotices } from './release-notices.mjs'
import { checkPublicHistory } from './check-public-history.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const preview = process.argv.includes('--preview')
const version = process.argv.find(arg => arg.startsWith('--version='))?.slice(10)
if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error('Pass --version=X.Y.Z (or X.Y.Z-prerelease)')
if (!preview && git('status', '--porcelain')) throw new Error('Publication requires a clean source tree; use --preview for local review')
if (!preview) checkPublicHistory()
if (!preview && git('rev-parse', `refs/tags/v${version}^{commit}`) !== git('rev-parse', 'HEAD')) throw new Error('Publication requires the matching vVERSION tag at HEAD')
const output = join(root, 'build/release')
rmSync(output, { recursive: true, force: true })
const name = `nocaljs-${version}${preview ? '-preview' : ''}`
const stage = join(output, name)
mkdirSync(join(stage, 'dist'), { recursive: true })
const files = readdirSync(join(root, 'dist')).filter(file => /\.(?:mjs|css|txt)$/.test(file)).sort()
if (files.filter(file => file.endsWith('.mjs')).length !== 7 || !files.includes('nocaljs.css')) throw new Error('Build all browser artifacts first')
for (const file of files) cpSync(join(root, 'dist', file), join(stage, 'dist', file))
cpSync(join(root, 'LICENSE'), join(stage, 'LICENSE'))
mkdirSync(join(stage, 'quickstart/vendor'), { recursive: true })
for (const file of ['index.html', 'counter.mjs']) cpSync(join(root, 'examples/counter', file), join(stage, 'quickstart', file))
for (const file of ['nocaljs-core.mjs', 'nocaljs.css']) cpSync(join(root, 'dist', file), join(stage, 'quickstart/vendor', file))
const notices = releaseNotices(root)
writeFileSync(join(stage, 'THIRD-PARTY-NOTICES.txt'), notices.text)
const notes = readFileSync(join(root, 'releases/browser.md'), 'utf8').replaceAll('{{VERSION}}', version)
writeFileSync(join(stage, 'RELEASE-NOTES.md'), notes)
writeFileSync(join(stage, 'README.md'), `# NocalJS ${version}\n\nServe this directory over HTTP (for example: python3 -m http.server 8080), then open /quickstart/. No npm install or bundler is needed.\n\nUse dist/nocaljs-core.mjs and dist/nocaljs.css for new browser projects. Optional factories and the larger default-export aggregate are described in RELEASE-NOTES.md. Keep LICENSE and THIRD-PARTY-NOTICES.txt with redistributed files.\n${preview ? '\nLOCAL PREVIEW: this is not a published release.\n' : ''}`)
const sha = data => createHash('sha256').update(data).digest('hex')
const inputs = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean).filter(path => !path.split('/').includes('spec'))
// Deleted index entries are absent from ls-files; fail rather than silently omit unexpected inputs.
const sourceFiles = inputs.sort().map(path => ({ path, sha256: sha(readFileSync(join(root, path))) }))
const manifest = {
    version, preview, sourceRevision: git('rev-parse', 'HEAD'),
    sourceState: preview ? 'local-preview' : 'clean-tag',
    sourceSnapshotSha256: sha(JSON.stringify(sourceFiles)),
    toolchain: { node: process.version, npm: execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim() },
    dependencies: notices.inventory,
    files: []
}
const walk = (directory, prefix = '') => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const path = prefix + entry.name
        if (entry.isDirectory()) walk(join(directory, entry.name), `${path}/`)
        else manifest.files.push({ path, sha256: sha(readFileSync(join(directory, entry.name))) })
    }
}
walk(stage)
writeFileSync(join(stage, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
execFileSync('python3', [join(root, 'scripts/archive.py'), stage, join(output, `${name}.zip`)])
const archive = `${name}.zip`
writeFileSync(join(output, 'SHA256SUMS'), `${sha(readFileSync(join(output, archive)))}  ${archive}\n`)
console.log(`Prepared ${archive} (${manifest.sourceState}, source ${manifest.sourceRevision})`)
