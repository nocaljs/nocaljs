import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

test('contributor lint accepts valid code and rejects undefined references', () => {
    const lint = source => spawnSync(process.execPath, [
        fileURLToPath(new URL('../node_modules/eslint/bin/eslint.js', import.meta.url)),
        '--stdin', '--stdin-filename', 'scripts/lint-probe.mjs'
    ], { cwd: fileURLToPath(new URL('../', import.meta.url)), input: source, encoding: 'utf8', timeout: 10000 })
    const valid = lint("console.log('valid')\n")
    assert.equal(valid.status, 0, valid.stderr)
    const invalid = lint('phaseTwoUndefinedReference()\n')
    assert.equal(invalid.status, 1, invalid.stderr)
    assert.match(invalid.stdout, /no-undef/)
})
