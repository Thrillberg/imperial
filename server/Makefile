ci: lint test

lint:
	test -z $(shell gofmt -s -l .) || (gofmt -s -d . && exit 1)

lint/fix:
	gofmt -s -w .

test:
	go test

run:
	go run .

build:
	GOOS=linux GOARCH=amd64 go build -o Imperial
