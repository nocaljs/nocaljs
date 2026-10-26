# NocalJS {{VERSION}} — browser release

This release brings the framework, optional libraries, examples and documentation into one repository. It provides versioned browser ES modules and CSS. npm publication remains planned.

Start with `quickstart/index.html`, served over HTTP. New applications should import named exports from `dist/nocaljs-core.mjs` and use `dist/nocaljs.css`. The core includes reactive state, DOM helpers, routing and models, including the compatible `val` helper.

Optional UI and config modules are default-export factories accepting the core namespace. `nocaljs-ext.mjs` has named `math` and `fmt` exports. CAD uses `nocaljs-cad2d-core.mjs`; the default factory from `nocaljs-cad2d-ext.mjs` accepts CAD and core. `nocaljs.mjs` is the larger **default-export aggregate**, with initialized optional APIs. It has a different import shape from the named-export core.

Keep `LICENSE` and `THIRD-PARTY-NOTICES.txt` when redistributing. `manifest.json` records the source revision, source snapshot fingerprint, bundled dependency versions and SHA-256 hashes. Verify the ZIP against the accompanying `SHA256SUMS` before extraction. A filename or manifest marked preview denotes local review output.

The existing `@cdn/dist/nocaljs.mjs` URL retains its historical named core exports. This release does not update that branch. Do not substitute the new aggregate at that URL.

For users of the separate `nocaljs-config` repository: the maintained implementation now lives in `packages/nocaljs-config` here. Its browser factory is initialized with `createConfig(core)`. Existing repository/CDN references remain available; migration is voluntary. See [MIGRATION.md](https://github.com/nocaljs/nocaljs/blob/main/MIGRATION.md).

The release has automated source, artifact and extracted-archive consumer checks. The website and examples were checked in Chrome at desktop/mobile widths. Broader browser compatibility and npm distribution are future work. Review the version label when assessing stability.
