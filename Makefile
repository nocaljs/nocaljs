.PHONY: cdn

cdn:
	npm run build
	git checkout cdn
	git pull
	git add dist/nanojs.mjs dist/nano.css
	git diff --exit-code || git commit -m 'Update CDN build'
	git push
	git checkout main