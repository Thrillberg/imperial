[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md) 
![](https://github.com/Thrillberg/imperial/workflows/Node.js%20CI/badge.svg)

# Imperial

This is an implementation of the board game, [Imperial](<https://en.wikipedia.org/wiki/Imperial_(board_game)>).

It can be played in production at [playimperial.club](https://playimperial.club).

_Please note that this project is released with a Contributor Code of Conduct.
By participating in this project you agree to abide by its terms._

## Local development setup

Imperial uses Ruby version 3.1.2, Redis (> 4.0) and PostgreSQL.

To run Imperial on your local machine, please follow these instructions:

1. Clone the repo:
```
git clone https://github.com/Thrillberg/imperial.git
```
2. Change directory into the `imperial` directory:
```
cd imperial
```
3. Run the Rails setup command:
```
bin/setup
```
- If you get the error `PG::InsufficientPrivilege: ERROR:  permission denied to create extension "pgcrypto"` run this command:
```
sudo su postgres -c "psql rails_server_development -c 'CREATE EXTENSION pgcrypto;'"
```
4. Run the npm install command:
```
npm install
```
5. In one terminal window, run webpack:
```
bin/webpack --watch
```
6. Keep webpack running and in a separate terminal window, run the Rails server:
```
rails s
```
If any of the above instructions did not work for you, please do not hesitate to [open an issue](https://github.com/Thrillberg/imperial/issues/new).

## Running tests

To run JS tests, run the following command from the project root:

```
npm test
```

To run Ruby RSpec tests, run the following command from the project root:

```
rspec
```

This project also uses [Cypress](https://www.cypress.io/) for feature tests. **These tests have not been maintained, however.** To
run these tests, run the following command from the project root:

```
bin/webpack
./test_server
```

And in another terminal:

```
npm run cypress
```
