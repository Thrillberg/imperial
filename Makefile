ci:
	make -C client ci
	make -C server ci

lint/fix:
	make -C client lint/fix
	make -C server lint/fix

test:
	make -C client test
	make -C server test
	
server/build:
	make -C server build

client/publish:
	make -C client publish

server/run:
	make -C server run

client/run:
	make -C client run
