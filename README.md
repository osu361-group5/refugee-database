# Refugee Database
This application attempts to solve the issue of helping distributed refugees.

## Installation
```bash
git clone https://github.com/osu361-group5/refugee-database.git
npm install
```

## Running App
Set environment variable for database host, ie
```bash
    export dbHost='localhost'
```

Then do `npm start`

To setup the database, do `npm run-script createDb`.  This will also
setup a test refugee user.

## Running/Writing tests
This project uses jasmine for testing.

tests go in the spec directory.  Each file should be of the following
format, `some_name_for_some_tests_spec.js` import part is the spec part.
All files ending in `spec.js` will be picked up by the testing harness.

running tests: from root of project, do `npm test`.  This assumes that you
have the environment variables properly set, `dbHost` should be set to `localhost`
if the postgres server is running locally.

running the tests using docker compose:
1) make sure the containers are running
```bash
$ docker-compose up
```
2) the previous step launched the app on port 3000.  you can execute
arbitrary commands on running containers, in this case, you will be running
the tests.  There is a npm script that runs the test commands in the running
container. Note, all the following commands need to run in the 
```bash
$ npm run-script testDocker
```
or you can use docker-compose directly
```bash
$ docker-compose exec app npm test
```

## Using Docker
If you have Docker & docker-compose installed, running the app is 
as simple as `docker-compose up`.  Currently, the app will be available
on your docker hosts port 3000.


## Live Link
link: [hosted on heroku](https://lit-tundra-42207.herokuapp.com/)

