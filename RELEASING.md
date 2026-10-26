# Browser releases and website deployment

## Prepare and inspect

Use the pinned contributor tools and Python environment. Select a release version explicitly; the existing package manifests are private workspace versions and do not establish a stable public release.

```sh
npm run release:prepare -- --version=0.1.0 --preview
npm run test:release
```

The first command runs the full check gate, then creates an explicitly marked preview ZIP, checksums and an inspectable directory in `build/release/`. The archive includes ESM/CSS, a runnable quickstart, release notes, licenses and a source/artifact manifest. It excludes source specifications, dependencies, fonts and editor metadata. Archive entries have fixed timestamps, permissions and order. Identical inputs and tool versions yield identical ZIPs.

Review `releases/browser.md`, the manifest, notices and extracted consumer results before publication. The extracted test reads the ZIP, verifies checksums and every manifest entry, and runs the counter and optional APIs from a temporary directory outside the checkout.

## Publish from safe public history

Never push the private development branch or use `git push --all`: its ancestry contains private specifications. Preserve that repository and its refs privately. Prepare a separate repository fetched only from public `nocaljs/nocaljs` main, copy the approved spec-free source snapshot onto it, inspect the entire staged diff and scan all reachable public history for `spec/` paths. This preserves existing public history without a force push. Do not copy `.git`, dependencies, generated outputs or private specs.

After the maintainer approves the exact snapshot, commit it in that separate repository and push the reviewed branch for integration. Do not move or overwrite `cdn`. The GitHub description proposal is “Lightweight reactive JavaScript framework with browser ES modules, optional libraries and runnable examples”; homepage: `https://nocal.dev`; topics: `javascript`, `reactive`, `frontend`, `web-components`, `esm`.

Once the approved source is committed on public main, tag that revision `vVERSION`. The manually dispatched browser-release workflow requires a matching tag at HEAD, a clean checkout, and passing checks. It uploads immutable review artifacts to Actions; it does not create a GitHub release automatically. Download and verify them, then explicitly publish a GitHub release for that tag with the ZIP, `SHA256SUMS` and release notes. Avoid GitHub's auto-generated source archives from any branch containing private ancestry.

## Deploy Pages before DNS

Enable Pages with source **GitHub Actions** in repository settings. The manual Pages workflow accepts only public main, runs the full check gate, uploads only `build/site/`, and uses the `github-pages` environment for deployment. Configure its protection rules if a separate reviewer is needed. Initially use `https://nocaljs.github.io/nocaljs/`; no custom domain or CNAME is built in.

Verify home, navigation, `/docs/`, quickstart, core/CSS assets and download links at the Pages URL. In the DNS provider, inventory the complete zone and preserve mail and unrelated records. Verify ownership in GitHub using its account-specific TXT value before setting the Pages custom domain. Replace only website apex A/AAAA records as appropriate with the [current GitHub Pages records](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), and point `www` to `nocaljs.github.io`. Keep the old website records for rollback. Set `nocal.dev` in Pages settings, wait for certificate issuance, enable HTTPS, and verify the www redirect and public assets. Do not change nameservers or mail records for this cutover.

Record the public source/tag, Actions run, archive digest, Pages deployment revision, DNS changes and HTTPS verification. Recheck the historical jsDelivr URL and its named `state`/`val` exports. Local checks alone do not establish a published release or successful domain cutover.
