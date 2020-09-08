ci: lint test

lint:
	test -z $(shell gofmt -s -l .) || (gofmt -s -d . && exit 1)

lint/fix:
	gofmt -s -w .

test:
	go test
