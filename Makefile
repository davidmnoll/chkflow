

test:
	npx tsc
	npm run test

package:
	# npm run test
	npx rollup -c

publish:
	npm uninstall react
	make package
	npm publish --access public
	npm install react