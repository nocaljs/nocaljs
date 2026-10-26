# Using the consolidated NocalJS repository

The framework, optional libraries, official website and runnable examples live in this repository. Standalone applications retain separate repositories.

For browser projects, download a versioned archive from [GitHub Releases](https://github.com/nocaljs/nocaljs/releases), verify `SHA256SUMS`, extract it and serve the `quickstart/` directory over HTTP. Until the first release is published, follow the source-build instructions in [README.md](README.md).

Use named core imports:

```js
import * as core from './dist/nocaljs-core.mjs'
import createConfig from './dist/nocaljs-config.mjs'

const { config } = createConfig(core)
```

The former standalone [nocaljs-config repository](https://github.com/nocaljs/nocaljs-config) is retained for existing consumers. New changes belong in `packages/nocaljs-config` here. It has not been archived or redirected automatically.

The historical URL `https://cdn.jsdelivr.net/gh/nocaljs/nocaljs@cdn/dist/nocaljs.mjs` keeps its named-export core contract. The new archive's `dist/nocaljs.mjs` is a default-export aggregate including CAD and other optional libraries. Switch to `dist/nocaljs-core.mjs` to preserve named core imports when adopting the archive.

The published website is intended for `https://nocal.dev/`, with the Markdown reference at `/docs/`. GitHub Pages can first serve the same static output at `https://nocaljs.github.io/nocaljs/`. Domain cutover is separate from source publication.
