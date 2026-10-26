import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export function checkPublicHistory() {
    const cwd = fileURLToPath(new URL('../', import.meta.url))
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
    if (git('rev-parse', '--is-shallow-repository') !== 'false') throw new Error('Fetch complete public history before publication')
    const paths = [...git('log', '--format=', '--name-only', 'HEAD').split('\n'), ...git('ls-files').split('\n')]
    if (paths.some(path => path.split('/').includes('spec'))) throw new Error('Private specification paths exist in source or ancestry; use the separate public-history candidate')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    checkPublicHistory()
    console.log('Complete source history contains no spec paths')
}
