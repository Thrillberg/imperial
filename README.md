[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md) 
![](https://github.com/Thrillberg/imperial/workflows/Node.js%20CI/badge.svg)

# Imperial

This is an implementation of the board game, [Imperial](<https://en.wikipedia.org/wiki/Imperial_(board_game)>).

It can be played in production at [playimperial.club](https://playimperial.club).

_Please note that this project is released with a Contributor Code of Conduct.
By participating in this project you agree to abide by its terms._

## Local development setup

Imperial uses Ruby version 3.2.2, PostgreSQL, and NodeJS.

To run Imperial on your local machine, please follow these instructions:

1. Clone the repo:
```
git clone https://github.com/Thrillberg/imperial.git
```
2. Change directory into the `imperial` directory:
```
cd imperial
```
3. Begin the PostgreSQL service:
- If installed through `brew`
```
brew services start postgresql
```
- If installed through `apt`
```
sudo service postgresql start
```
4. Run the Rails setup command:
```
bin/setup
```
- If you get the error `PG::InsufficientPrivilege: ERROR:  permission denied to create extension "pgcrypto"` run this command:
```
sudo su postgres -c "psql rails_server_development -c 'CREATE EXTENSION pgcrypto;'"
```
- If you get the error `‘ruby\r’: No such file or directory`, make sure your editor's line-endings are set to `LF` instead of `CRLF`.
6. Run the yarn install command:
```
yarn
```
7. In one terminal window, run vite:
```
bin/vite dev
```
8. Keep vite running and in a separate terminal window, run the Rails server:
```
rails s
```
9. You can now view the app at
```
localhost:3000/
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
./test_server
```

And in another terminal:

```
npm run cypress
```

## Docker commands for running locally

```
docker-compose up --build
```

## Local debugging

Production games will often present situations that are hard to reproduce locally and therefore get challening to debug. Therefore, we have implemented the ability to **export** and **import** games.

### Exporting a game

Visit `/exports/[game_id]` and a `JSON` file will be downloaded to your computer. This file contains the game log and can be used when importing a game.

### Importing a game

Visit `http://localhost:3000/import_game` and paste the contents of the downloaded `JSON` in the box and click `Import game`. This will reconstruct the game locally in your database and let you play around with it and, hopefully, improve debugging.
