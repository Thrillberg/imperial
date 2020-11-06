ci:
	make -C client ci
	make -C server ci

lint/fix:
	make -C client lint/fix
	make -C server lint/fix

test:
	make -C client test
	make -C server test

client/test/unit:
	make -C client test/unit
	
client/test/integration:
	make -C client test/integration

server/build:
	make -C server build

client/deploy:
	make -C client deploy

server/run:
	make -C server run

client/run:
	make -C client run
