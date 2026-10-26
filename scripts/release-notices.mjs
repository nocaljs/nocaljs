import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

export function releaseNotices(root) {
    const stats = JSON.parse(readFileSync(join(root, 'build/aggregate-stats.json'), 'utf8'))
    const packages = new Map()
    const visit = modules => {
        for (const module of modules || []) {
            visit(module.modules)
            const filename = module.nameForCondition
            if (!filename?.includes('/node_modules/')) continue
            let directory = dirname(filename)
            while (!existsSync(join(directory, 'package.json'))) {
                const parent = dirname(directory)
                if (parent === directory) throw new Error(`No package for ${filename}`)
                directory = parent
            }
            const pkg = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
            packages.set(`${pkg.name}@${pkg.version}`, { pkg, directory })
        }
    }
    visit(stats.modules)
    if (!packages.has('makerjs@0.18.1') || packages.size < 5) throw new Error('Incomplete webpack dependency inventory')
    // OpenType ships a pre-bundled module: webpack cannot expose its inner graph.
    // Preserve its own explicit attributions and supplemental full license texts.
    const opentype = packages.get('opentype.js@1.3.4')
    if (!opentype) throw new Error('Review embedded dependency notices for the new OpenType version')
    const require = createRequire(join(opentype.directory, 'package.json'))
    for (const name of ['tiny-inflate', 'string.prototype.codepointat']) {
        const directory = dirname(require.resolve(`${name}/package.json`))
        const pkg = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
        packages.set(`${name}@embedded-in-opentype-1.3.4`, {
            directory, pkg: { ...pkg, version: 'embedded-in-opentype-1.3.4', licenseTextSourceVersion: pkg.version }
        })
    }
    const inventory = []
    const notices = ['# Third-party notices', '', 'These dependencies are included in the optional CAD and aggregate browser bundles. Core has no bundled third-party dependencies.', '']
    for (const [identity, { pkg, directory }] of [...packages].sort(([a], [b]) => a.localeCompare(b))) {
        const candidates = ['LICENSE', 'LICENSE.txt', 'LICENSE.md', 'license.txt', 'LICENSE-MIT.txt']
        let license = candidates.find(name => existsSync(join(directory, name)))
        let text
        if (license) text = readFileSync(join(directory, license), 'utf8')
        else if (identity === 'bezier-js@2.6.1') {
            license = 'licenses/bezier-js-2.6.1.txt'
            text = readFileSync(join(root, license), 'utf8')
        } else throw new Error(`Missing license text for ${identity}`)
        inventory.push({ name: pkg.name, version: pkg.version, license: pkg.license, ...(pkg.licenseTextSourceVersion ? { licenseTextSourceVersion: pkg.licenseTextSourceVersion } : {}) })
        notices.push(`## ${identity} (${pkg.license})`, '', text.trim(), '')
        if (pkg.name === 'makerjs') notices.push('Copyright (c) Microsoft Corporation. All rights reserved.', '')
        if (pkg.licenseTextSourceVersion) notices.push(`Embedded in OpenType 1.3.4, whose header credits Devon Govett (tiny-inflate) and Mathias Bynens (codepointat, banner v0.2.0). Exact embedded dependency versions are not established by the package graph. Full license text supplied from ${pkg.name}@${pkg.licenseTextSourceVersion}.`, '')
    }
    notices.push('## License provenance', '', 'bezier-js 2.6.1 ships an MIT declaration and Pomax attribution in lib/bezier.js, but no license file. The accompanying MIT permission text is retained in licenses/bezier-js-2.6.1.txt. See licenses/README.md in the source tree.', '')
    return { inventory, text: notices.join('\n') }
}
