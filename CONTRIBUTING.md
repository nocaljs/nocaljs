# Contributing

Use Node 24.22.1, npm 11.6.2 and Python 3.11. Install from the root with `npm ci`. Create a Python virtual environment and install `packages/nocaljs-docs/requirements.txt`, then run `npm run check`. See [README.md](README.md#contributor-checks) for commands.

Library source lives in `packages/`; `apps/site/` contains the official website and `examples/` contains framework examples. The root lockfile is authoritative. Generated `dist/`, vendor assets and `build/` are ignored. Specifications are maintained privately and must not be added to this repository or release artifacts.

Open an issue describing a bug and reproduction, or propose a focused pull request with validation. Keep existing core imports compatible. Include relevant source or artifact assertions for behavior changes; documentation-only changes need the strict docs build when they affect the reference.

Release preparation is described in [RELEASING.md](RELEASING.md). npm publication and standalone application migration are separate work.
