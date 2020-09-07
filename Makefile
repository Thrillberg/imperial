ci:
	cd client && npm ci
	cd client && npm test
	cd client && npm run lint
