import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseHTML } from 'linkedom'

const root = fileURLToPath(new URL('../../', import.meta.url))
const output = join(root, 'build/release')
const archives = readdirSync(output).filter(name => name.endsWith('.zip'))
assert.equal(archives.length, 1, 'prepare exactly one archive before running the release gate')
const archive = archives[0]
const bytes = readFileSync(join(output, archive))
const sha = data => createHash('sha256').update(data).digest('hex')
const temporary = mkdtempSync(join(tmpdir(), 'nocal-release-consumer-'))
after(() => rmSync(temporary, { recursive: true, force: true }))
execFileSync('python3', ['-c', `
import pathlib, sys, zipfile
with zipfile.ZipFile(sys.argv[1]) as archive:
    for name in archive.namelist():
        p = pathlib.PurePosixPath(name)
        assert not p.is_absolute() and '..' not in p.parts
        assert not set(p.parts) & {'spec', '.git', 'node_modules', 'fonts'}
    archive.extractall(sys.argv[2])
`, join(output, archive), temporary])
const extracted = join(temporary, archive.slice(0, -4))
const manifest = JSON.parse(readFileSync(join(extracted, 'manifest.json'), 'utf8'))

test('download checksum and every extracted manifest entry match', () => {
    assert.equal(readFileSync(join(output, 'SHA256SUMS'), 'utf8'), `${sha(bytes)}  ${archive}\n`)
    assert.match(manifest.sourceRevision, /^[a-f0-9]{40}$/)
    assert.match(manifest.sourceSnapshotSha256, /^[a-f0-9]{64}$/)
    for (const file of manifest.files) assert.equal(sha(readFileSync(join(extracted, file.path))), file.sha256, file.path)
    const list = (directory, prefix = '') => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? list(join(directory, entry.name), `${prefix}${entry.name}/`) : [`${prefix}${entry.name}`])
    assert.deepEqual(list(extracted).sort(), [...manifest.files.map(file => file.path), 'manifest.json'].sort())
    const notices = readFileSync(join(extracted, 'THIRD-PARTY-NOTICES.txt'), 'utf8')
    for (const dependency of manifest.dependencies) assert.ok(notices.includes(`${dependency.name}@${dependency.version}`))
    for (const required of ['Apache License', 'Permission is hereby granted', 'Microsoft Corporation', 'Pomax']) assert.ok(notices.includes(required), required)
    assert.doesNotMatch(notices, /\/Users\/|node_modules\//)
})

test('extracted counter increments and resets using only the downloaded core', async () => {
    const { window } = parseHTML(readFileSync(join(extracted, 'quickstart/index.html'), 'utf8'))
    Object.assign(globalThis, { window, document: window.document, HTMLElement: window.HTMLElement })
    await import(pathToFileURL(join(extracted, 'quickstart/counter.mjs')))
    assert.equal(document.querySelector('output').textContent, '0')
    document.querySelector('button').click()
    await Promise.resolve()
    assert.equal(document.querySelector('output').textContent, '1')
    document.querySelectorAll('button')[1].click()
    await Promise.resolve()
    assert.equal(document.querySelector('output').textContent, '0')
})

test('extracted optional and aggregate APIs initialize without workspace imports', async () => {
    const load = file => import(pathToFileURL(join(extracted, 'dist', file)))
    const core = await load('nocaljs-core.mjs')
    assert.equal(core.val(core.state(5)), 5)
    for (const [file, method] of [['nocaljs-ui.mjs', 'dial'], ['nocaljs-config.mjs', 'config']]) {
        assert.equal(typeof (await load(file)).default(core)[method], 'function')
    }
    const cad = await load('nocaljs-cad2d-core.mjs')
    const utilities = await load('nocaljs-ext.mjs')
    assert.equal(utilities.fmt.n(2)(1.234), '1.23')
    const { default: ext } = await load('nocaljs-cad2d-ext.mjs')
    const rectangle = cad.model.rectangle(10, 20)
    assert.equal(ext(cad, core).pipe.on('cut')(rectangle).layer, 'cut')
    assert.match(cad.model.to.svg(rectangle), /<svg/)
    const { default: all } = await load('nocaljs.mjs')
    assert.equal(typeof all.config.config, 'function')
    assert.equal(typeof all.ui.download, 'function')
    assert.equal(all.ext.fmt.n(2)(1.234), '1.23')
})

test('archive bytes are reproducible from the same source and toolchain', () => {
    const args = ['scripts/release.mjs', `--version=${manifest.version}`]
    if (manifest.preview) args.push('--preview')
    execFileSync(process.execPath, args, { cwd: root })
    assert.deepEqual(readFileSync(join(output, archive)), bytes)
})

test('release version and publication gates reject invalid requests', () => {
    for (const version of ['', '../unsafe', 'v1.0.0', '1.0']) {
        const result = spawnSync(process.execPath, ['scripts/release.mjs', `--version=${version}`, '--preview'], { cwd: root, encoding: 'utf8' })
        assert.notEqual(result.status, 0)
        assert.match(result.stderr, /Pass --version/)
    }
    if (manifest.preview) {
        const result = spawnSync(process.execPath, ['scripts/release.mjs', `--version=${manifest.version}`], { cwd: root, encoding: 'utf8' })
        assert.notEqual(result.status, 0)
    }
})
