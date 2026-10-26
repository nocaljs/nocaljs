# NocalJS website

This is the official website source, imported from the existing NocalJS site working tree. `SOURCE.json` records the original revision and hashes of the imported authored files, including local edits. Standalone ecosystem applications are maintained separately.

The site uses NocalJS DOM helpers, state and routing. It includes five live examples, a runnable quickstart, and the canonical Markdown reference. Standalone ecosystem applications remain in their own repositories.

From the repository root, with the pinned toolchain and documentation dependencies installed:

```sh
npm ci
npm run site:build
npm run site:preview
```

Open `http://localhost:8080/`. The combined static output is in ignored `build/site/`, with the reference under `/docs/`. It can be served by any static HTTP host, including under a URL prefix. No deployment occurs during the build.

Each live example runs in its own frame so its state and router are released on navigation. Source panes use the same module URL as the demo; the initial source cache is generated from those files. Getting Started displays the actual files in `quickstart/`. The initial home HTML is rendered from the same components at build time to provide a stable, readable first paint.

`npm run check` tests the combined output, including all local HTML links/assets, example behavior and source identity. Generated vendor assets stay out of source control. `SOURCE.json` remains the original import manifest, not a hash list for subsequent edits. Development specs are maintained separately. Release packaging, hosting and nocal.dev cutover are separate publication work.
